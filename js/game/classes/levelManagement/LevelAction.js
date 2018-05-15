// Implementation of the <action> tag

// Attribute - type = (fast | slow), label? = STRING
// slow: wait for the action(s) to be .done()
// fast: run all actions in parallel (except wait)

// Contents - ttl?, ctl?, (repeat | spawn | wait | action | actionRef)*

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
      switch (this.node.children[i].nodeName) {
        case 'ttl':
          this.ttl = LevelExpression.eval(this.node.children[i].innerHTML);
          break;
        case 'ctl':
          this.ctl = this.node.children[i].innerHTML;
          break;
        default:
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
      // we have a node
      switch (node.nodeName) {
        case 'ctl':
        case 'ttl':
          // skip
          this.readNextNode();
          break;
        case 'wait':
          this.actions.push(new LevelWait(node));
          this.currentChild = this.actions[this.actions.length - 1];
          break;
        case 'repeat':
          this.actions.push(new LevelRepeat(node));
          break;
        case 'spawn':
          this.actions.push(new LevelSpawn(node));
          break;
        case 'action':
          this.actions.push(new LevelAction(node));
          break;
        case 'objective':
          this.actions.push(new LevelObjectiveText(node));
          break;
        case 'var':
          this.actions.push(new LevelVariable(node));
          break;
        default:
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

  update(delta) {
    // update all actions
    this.actions.forEach((action) => {
      action.update(delta);
    });
    // add new children
    while (this.currentChild !== null && this.currentChild.done()) {
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
    // if we only have unimportant children we just kill ourselves
    if (this.isDone && this.actions.every(a => a.unimportant())) {
      this.kill();
    } else if (this.ctl !== undefined && !LevelEvaluation.eval(this.ctl)) {
      this.kill();
    } else if (this.ttl !== undefined) {
      // we might not live forever
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
