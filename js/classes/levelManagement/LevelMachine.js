// Implementation of a Parser to manage levelstate

class LevelMachine {
  constructor() {
    this.loadLevel(level0);
    return this;
  }

  update(delta) {
    this.action.update(delta);
    if (this.action.remove()) {
      console.log('level cleared');
    }
    return this;
  }

  loadLevel(newLevel) {
    const parser = new DOMParser();
    this.level = parser.parseFromString(newLevel, 'application/xml').documentElement.children[0];
    this.action = new LevelAction(this.level);
  }
}
