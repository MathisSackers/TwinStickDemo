// Template for tags

// Attribute - type = (fast | slow), label? = STRING
// slow: wait for the action(s) to be .done()
// fast: run all actions in parallel (except wait)

// Contents - ttl?, (repeat | spawn | wait | action | actionRef)*

// Example

// <action type='slow'>
//  <action type='slow'>
//   ...
//  </action>
//  <wait type='time'>120</wait>
//  <action>
//   ...
//  </action>
//  <repeat type='fast'>
//    ...
//  </repeat>
// </action>

class LevelAction extends LevelObject {
  constructor(node) {
    super();
    this.node = node;
    this.actions = [];
    this.currentChildIndex = 0;
    this.currentChild = null;
    this.scanNodes();
    this.readAttributes();
    this.readNextNode();
    return this;
  }

  scanNodes() {
    for (let i = 0; i < this.node.children.length; i += 1) {
      if (this.node.children[i].nodeName === 'ttl') {
        this.ttl = this.node.children[i].innerHTML;
      }
    }
  }

  readAttributes() {
    for (let i = 0; i < this.node.attributes.length; i += 1) {
      const attribute = this.node.attributes[i];
      if (attribute.name === 'type') {
        this.slow = attribute.value === 'slow';
      } else {
        console.error('Unknown attribute: ', attribute);
        console.error('..on node: ', this.node);
      }
    }
  }

  readNextNode() {
    const node = this.node.children[this.currentChildIndex];
    this.currentChildIndex += 1;
    if (node !== undefined) {
      if (node.nodeName === 'ttl') {
        // skip
        this.readNextNode();
      } else {
        // we have an actionable node
        if (node.nodeName === 'wait') {
          this.actions.push(new LevelWait(node));
          this.currentChild = this.actions[this.actions.length - 1];
        } else if (node.nodeName === 'repeat') {
          this.actions.push(new LevelRepeat(node));
        } else if (node.nodeName === 'spawn') {
          this.actions.push(new LevelSpawn(node));
        } else if (node.nodeName === 'action') {
          this.actions.push(new LevelAction(node));
        } else {
          // Invalid input
          console.error('Unknown node: ', node);
        }
        if (this.currentChild === null) {
          if (this.slow) {
            this.currentChild = this.actions[this.actions.length - 1];
          } else {
            this.readNextNode();
          }
        }
      }
    }
  }

  update(delta) {
    // update all actions
    this.actions.forEach((action) => {
      action.update(delta);
    });
    // add new children
    if (this.currentChild !== null && this.currentChild.done()) {
      this.currentChild = null;
      this.readNextNode();
    }
    // no current child; all done.
    this.isDone = this.currentChild === null;
    // remove unneeded children
    for (let i = this.actions.length - 1; i >= 0; i -= 1) {
      if (this.actions[i].remove()) {
        this.actions.splice(i, 1);
      }
    }
    // we might not live forever
    if (this.ttl !== undefined) {
      this.ttl -= delta;
      if (this.ttl <= 0) {
        this.kill();
      }
    }
    return this;
  }

  remove() {
    return this.actions.length === 0;
  }

  kill() {
    this.actions.forEach((action) => {
      action.kill();
    });
    this.isDone = true;
    this.actions = [];
    this.currentChild = null;
  }
}
