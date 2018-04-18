// The state base-class and its implemntations

// Base class
class State {
  constructor() {
    return this;
  }

  update() {
    return this;
  }

  exit() {
    return this.name;
  }
}

// when game is playable (shooting and stuff)
class PlayState extends State {
  constructor(lastState) {
    super();
    this.name = 'PlayState';
    if (lastState !== 'PauseState' && lastState !== 'PlayState') {
      createHeroes(game.usedPads.length);
      game.levelmachine.loadLevel(level0);
    }
  }
  update(delta) {
    let counter = 0;
    game.usedPads.forEach((pad) => {
      const input = getInput(pad);
      // global inputs
      // pause
      if (input.B_press) {
        game.statemachine.transition('PauseState');
      }
      // spawning enemies
      if (input.A_press) {
        game.levelmachine.loadLevel(level0);
      }
      // this guy handdles his own input
      heroes[counter].update(input, delta);
      counter += 1;
    });
    hitScan();
    moveBullets(delta);
    moveEnemyBullets(delta);
    updateEnemies(delta);
    moveHitMarkers();
    // update the level
    game.levelmachine.update(delta);
    // check if all heroes are dead
    if (
      heroes.every((hero) => {
        if (hero.onScreen) {
          return false;
        }
        return true;
      })
    ) {
      game.statemachine.transition('DeathState');
    }
    return this;
  }
}

class PauseState extends State {
  constructor() {
    super();
    this.name = 'PauseState';
    game.text.setText('PAUSED', 0, true);
    game.text.show();
    gameContainer.alpha = 0.3;
  }
  update() {
    game.usedPads.forEach((pad) => {
      const input = getInput(pad);
      if (input.B_press) {
        game.statemachine.transition('PlayState');
      }
      if (input.A_press) {
        muted = sound.toggleMuteAll();
      }
    });
    return this;
  }
  exit() {
    game.text.hide();
    gameContainer.alpha = 1;
    return this.name;
  }
}

class DeathState extends State {
  constructor() {
    super();
    this.name = 'DeathState';
    setEntitiesInvisible();
    game.text.setText('Hit ok to try again.');
    game.text.show();
  }
  update() {
    game.usedPads.forEach((pad) => {
      const input = getInput(pad);
      if (input.A_press) {
        game.statemachine.transition('PlayState');
      }
    });
    return this;
  }
  exit() {
    game.text.hide();
    return this.name;
  }
}

class BindingState extends State {
  constructor() {
    super();
    this.name = 'BindingState';
    this.numPlayers = 0;
    game.text.setText('Connect a controller (or press A to activate it)', 0);
    game.text.show();
    // connected controllers
    this.connectedPads = [];
  }
  update() {
    // update the connected gamepads
    this.connectedPads = [...new Set(this.connectedPads.concat(getPads()))];
    if (this.connectedPads.length !== this.numPlayers) {
      // new layout
      this.numPlayers = this.connectedPads.length;
      game.text.setNumTexts(this.numPlayers);
    }
    // binding
    let counter = 0;
    this.connectedPads.forEach((connectedPad) => {
      // get input
      const bindIn = bindControls(connectedPad);
      if (bindIn === true) {
        game.usedPads.push(connectedPad);
        game.text.setText('Press A to start the game.', counter);
      } else if (bindIn !== false) {
        game.text.setText(bindIn, counter);
      }
      counter += 1;
    });
    // start game
    game.usedPads.forEach((pad) => {
      const input = getInput(pad);
      if (input.A_press) {
        game.statemachine.transition('PlayState');
      }
    });
    return this;
  }
  exit() {
    game.text.setNumTexts(1);
    game.text.hide();
    gameContainer.alpha = 1.0;
    gameContainer.visible = true;
    return this.name;
  }
}
