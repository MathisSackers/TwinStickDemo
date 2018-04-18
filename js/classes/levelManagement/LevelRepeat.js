// Implementation of the <repeat> tag

// Attribute - type = (fast | slow)
// slow: wait for the action to be .done()
// fast: run all actions in parallel

// Contents - times, ttl?, (action | actionRef)

// Example
// <repeat type='slow'>
// <times>100</times>
// <action>
//  ...
// </action>
// </repeat>


// <times> - Specifies the number of times
// Contents - EXPRESSION

// Specifies the number of times.

class LevelRepeat extends LevelObject {
  constructor(node) {
    super();
    this.node = node;
    this.actions = [];
    this.times = 0;
    this.readAttributes();
    this.readNodes();
    return this;
  }

  readAttributes() {
    for (let i = 0; i < this.node.attributes.length; i += 1) {
      const attribute = this.node.attributes[i];
      if (attribute.name === 'type') {
        this.slow = attribute.value === 'slow';
      } else {
        console.error('Unknown attribute: ', attribute);
      }
    }
  }

  readNodes() {
    for (let i = 0; i < this.node.children.length; i += 1) {
      const node = this.node.children[i];
      if (node.nodeName === 'times') {
        // TODO expression evaluation
        this.times += node.innerHTML;
      } else if (node.nodeName === 'ttl') {
        this.ttl = node.innerHTML;
      } else if (node.nodeName === 'action') {
        this.actionNode = node;
      } else if (node.nodeName === 'actionRef') {
        // TODO
      } else {
        // Invalid input
        console.error('Unknown node: ', node);
      }
    }
  }

  update(delta) {
    // update all actions
    this.actions.forEach((action) => {
      action.update(delta);
    });
    // add new actions
    while (
      this.times > 0 &&
      (!this.slow ||
        (this.currentAction === undefined || this.currentAction.done()))
    ) {
      this.actions.push(new LevelAction(this.actionNode));
      this.currentAction = this.actions[this.actions.length - 1];
      this.times -= 1;
    }
    // last action running / already done?
    if (this.times === 0) {
      this.isDone = this.actions.every(action => action.done());
      if (this.isDone && this.debug === undefined) {
        alert('woop');
        this.debug = true;
      }
    }
    // remove unneeded actions
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
    return this.actions.length === 0 && this.times === 0;
  }

  kill() {
    this.actions.forEach((action) => {
      action.kill();
    });
    this.actions = [];
    this.currentChild = null;
  }
}
