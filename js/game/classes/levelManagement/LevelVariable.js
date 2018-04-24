// Implementation of the <variable> tag

// Attributes - type = (set | add | clear) name = STRING
// set: set variable >name< to Content
// add: add Content to variable >name< to specified value
// clear: removes variable >name<

// Contents - EXPRESSION


// Example
// <var type="set" name="myVar">($rand) + 10</var>
// <var type="add" name="myVar">-5</var>
// <var type="clear" name="myVar"></var>


class LevelVariable extends LevelObject {
  constructor(node) {
    super();
    this.node = node;
    this.readAttributes();
    return this;
  }

  readAttributes() {
    for (let i = 0; i < this.node.attributes.length; i += 1) {
      const attribute = this.node.attributes[i];
      switch (attribute.name) {
        case 'type':
          this.type = attribute.value;
          break;
        case 'name':
          this.variableName = attribute.value;
          break;
        default:
          console.error('Unknown attribute: ', attribute);
      }
    }
    if (this.type === undefined) {
      console.error('No type specified:', this.node);
    }
    if (this.variableName === undefined) {
      console.error('No name specified:', this.node);
    }
    switch (this.type) {
      case 'set':
        game.levelmachine.variables[this.variableName] = LevelExpression.eval(this.node.innerHTML);
        break;
      case 'add':
        if (game.levelmachine.variables[this.variableName] === undefined) {
          console.error(`Expected ${this.variableName} to already posses a value`);
        }
        game.levelmachine.variables[this.variableName] += LevelExpression.eval(this.node.innerHTML);
        break;
      case 'clear':
        if (game.levelmachine.variables[this.variableName] === undefined) {
          console.error(`Expected ${this.variableName} to not be cleared already`);
        }
        game.levelmachine.variables[this.variableName] = undefined;
        break;
      default:
        console.error('Unknown type: ', this.type);
    }
    this.isDone = true;
  }

  kill() {
    this.node = undefined;
    this.type = undefined;
    this.variableName = undefined;
  }
}
