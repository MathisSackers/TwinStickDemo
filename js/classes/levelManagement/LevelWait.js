// Implementation of the <wait> tag

// Attributes - type = (time | condition)

// time: wait for specified frames
// Contents - NUMBER

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
          // TODO
        } else {
          console.error('Unknown type: ', attribute.value);
        }
      } else {
        console.error('Unknown attribute: ', attribute);
      }
    }
    if (this.time === undefined) {
      console.error('No type specified:', this.node);
    }
  }

  update(delta) {
    if (this.time > 0) {
      this.time -= delta;
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
    if (this.time !== undefined) {
      this.time = 0;
    }
    this.isDone = true;
  }
}
