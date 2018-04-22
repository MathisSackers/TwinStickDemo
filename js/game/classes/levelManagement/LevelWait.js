// Implementation of the <wait> tag

// Attributes - type = (time | condition)

// time: wait for specified frames
// Contents - EXPRESSION

// condition: TODO: wait until the condition is met
// Contents - CONDITION

// Example
// <wait type="time">($rand * $playerNum) + 10</wait>

// <wait type="condition">???</wait>


class LevelWait extends LevelObject {
  constructor(node) {
    super();
    this.node = node;
    this.readAttributes();
    return this;
  }

  readAttributes() {
    for (let i = 0; i < this.node.attributes.length; i += 1) {
      const attribute = this.node.attributes[i];
      if (attribute.name === 'type') {
        if (attribute.value === 'time') {
          this.time = LevelExpression.eval(this.node.innerHTML);
        } else if (attribute.value === 'condition') {
          this.condition = this.node.innerHTML;
        } else {
          console.error('Unknown type: ', attribute.value);
        }
      } else {
        console.error('Unknown attribute: ', attribute);
      }
    }
    if (this.time === undefined && this.condition === undefined) {
      console.error('No type specified:', this.node);
    }
  }

  update(delta) {
    if (!this.isDone) {
      if (this.time > 0) {
        this.time -= delta;
      } else if (this.condition !== undefined) {
        this.isDone = LevelEvaluation.eval(this.condition);
      }
    }
    return this;
  }

  done() {
    if (this.time !== undefined) {
      return this.time <= 0;
    }
    return this.isDone;
  }

  remove() {
    if (this.time !== undefined) {
      return this.time <= 0;
    }
    return this.isDone;
  }

  kill() {
    this.time = undefined;
    this.condition = undefined;
    this.isDone = true;
  }
}
