// Implementation of the <wait> tag

// Attributes - type = (time | condition)

// time: wait for specified frames
// Contents - EXPRESSION

// condition: wait until the condition is met
// Contents - EVALUATION

// Example
// <wait type="time">($rand * $playerNum) + 10</wait>

// <wait type="condition">$playersAlive > $numEnemies</wait>


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
        switch (attribute.value) {
          case 'time':
            this.time = LevelExpression.eval(this.node.innerHTML);
            break;
          case 'condition':
            this.condition = this.node.innerHTML;
            break;
          default:
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
