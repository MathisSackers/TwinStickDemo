// The state base-class and its implemntations

// color for texts
const TEXT_COLOR = 0xe1ddcf;

function setText(string, wide = false) {
  if (game.t === undefined) {
    // text object
    game.t = new Text('...');
    game.t.style = { fill: TEXT_COLOR };
    game.t.x = (window.innerWidth / 2) - (game.t.width / 2);
    game.t.y = window.innerHeight / 3;
    game.stage.addChild(game.t);
  }
  if (wide) {
    game.t.style = { fontSize: 65, fill: TEXT_COLOR, letterSpacing: window.innerWidth / 10 };
  } else {
    game.t.style = { fill: TEXT_COLOR };
  }
  game.t.text = string;
  game.t.x = (window.innerWidth / 2) - (game.t.width / 2);
  game.t.visible = true;
}

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
    if (lastState !== 'PauseState') {
      createHero();
    }
  }
  update(delta) {
    const input = getInput(game.connectedPads[0]);
    // global inputs
    // pause
    if (input.B_press) {
      game.statemachine.transition('PauseState');
    }
    // spawning enemies
    if (input.A_press) {
      spawnEnemy();
    }
    // this guy handdles his own input
    hero.update(input, delta);
    if (hero.hp <= 0) {
      game.statemachine.transition('DeathState');
    }
    hitScan();
    moveBullets(delta);
    moveEnemyBullets(delta);
    updateEnemies(delta);
    moveHitMarkers();
    return this;
  }
}

class PauseState extends State {
  constructor() {
    super();
    this.name = 'PauseState';
    setText('PAUSED', true);
    gameContainer.alpha = 0.3;
  }
  update() {
    const input = getInput(game.connectedPads[0]);
    if (input.B_press) {
      game.statemachine.transition('PlayState');
    }
    if (input.A_press) {
      muted = sound.toggleMuteAll();
    }
    return this;
  }
  exit() {
    game.t.visible = false;
    gameContainer.alpha = 1;
    return this.name;
  }
}

class DeathState extends State {
  constructor() {
    super();
    this.name = 'DeathState';
    setEntitiesInvisible();
    setText('Hit ok to try again.');
  }
  update() {
    const input = getInput(game.connectedPads[0]);
    if (input.A_press) {
      game.statemachine.transition('PlayState');
    }
    return this;
  }
  exit() {
    game.t.visible = false;
    return this.name;
  }
}

class BindingState extends State {
  constructor() {
    super();
    this.name = 'BindingState';
    setText('Connect a controller (or press A to activate it)');
  }
  update() {
    if (game.connectedPads.length === 0) {
      game.connectedPads = game.connectedPads.concat(getPads());
    } else {
      // get input
      const bindIn = bindControls(game.connectedPads[0]);
      if (bindIn === true) {
        game.statemachine.transition('PlayState');
      } else if (bindIn !== false) {
        setText(bindIn);
      }
    }
    return this;
  }
  exit() {
    game.t.visible = false;
    gameContainer.alpha = 1.0;
    gameContainer.visible = true;
    return this.name;
  }
}
