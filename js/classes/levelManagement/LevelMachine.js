// Implementation of a Parser to manage levelstate

class LevelMachine {
  constructor() {
    this.action = null;
    // this.loadLevel(level0);
    return this;
  }

  update(delta) {
    if (this.action !== null) {
      this.action.update(delta);
      if (this.action.done()) {
        this.action.kill();
        this.action = null;
        console.log('level cleared');
      }
    }
    return this;
  }

  loadLevel(newLevel) {
    if (this.action !== null) {
      this.action.kill();
      this.action = null;
      console.log('Level killed to load new one.');
    }
    const parser = new DOMParser();
    [this.level] = parser.parseFromString(newLevel, 'application/xml').documentElement.children;
    this.action = new LevelAction(this.level);
  }
}
