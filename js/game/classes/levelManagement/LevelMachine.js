// Implementation of a Parser to manage levelstate

class LevelMachine {
  constructor() {
    if (game.levelmachine !== undefined) {
      console.error('You shouldn\'t create multiple instances of LevelMachine');
    }
    this.action = null;
    this.variables = {};
    return this;
  }

  update(delta) {
    if (this.action !== null) {
      this.action.update(delta);
      if (this.action.done()) {
        game.statemachine.transition('WinState');
      }
    }
    return this;
  }

  loadLevel(newLevel) {
    if (this.action !== null) {
      this.action.kill();
      this.action = null;
    }
    // reset variables...
    this.variables = {
      playerNum: game.usedPads.length,
      playersAlive: game.usedPads.length,
      rank: 0.5,
    };
    const parser = new DOMParser();
    [this.level] = parser.parseFromString(newLevel, 'application/xml').documentElement.children;
    this.action = new LevelAction(this.level);
  }

  kill() {
    this.action.kill();
  }
}
