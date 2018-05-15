// before playing the game, to bind(/calibrate) the gamepads
class BindingState extends State {
  constructor() {
    super();
    this.name = 'BindingState';
    this.numPlayers = 0;
    game.text.setText('Connect a controller (or press A to activate it)', 0);
    game.text.show();
    console.log(game.text);
    // connected controllers
    this.connectedPads = [];
    this.leaving = [];
  }
  update(delta) {
    // update the connected gamepads
    this.connectedPads = [...new Set(this.connectedPads.concat(GamepadUtil.getPads()))];
    if (this.connectedPads.length !== this.numPlayers) {
      // new layout
      this.numPlayers = this.connectedPads.length;
      // adjust number of texts
      game.text.setNumTexts(this.numPlayers);
      // reset leaving;
      for (let i = 0; i < this.numPlayers; i += 1) {
        this.leaving[i] = 0;
      }
    }
    // binding
    let padIndex = 0;
    this.connectedPads.every((connectedPad) => {
      // needs binding
      if (!game.usedPads.includes(connectedPad)) {
        // get input
        const bindIn = GamepadUtil.bindControls(connectedPad);
        if (bindIn === true) {
          game.usedPads.push(connectedPad);
        } else if (bindIn !== false) {
          game.text.setText(bindIn, padIndex);
        }
      } else {
        // already bound
        game.text.setText('Press A to start the game. Hold B to leave', padIndex);
        const input = GamepadUtil.getInput(connectedPad);
        if (input.A_press) {
          // start game
          game.statemachine.transition('PlayState');
          return false;
        } else if (input.B_down) {
          this.leaving[padIndex] += delta;
          if (this.leaving[padIndex] > 60) {
            game.usedPads.splice(game.usedPads.indexOf(connectedPad), 1);
            GamepadUtil.resetBinding(connectedPad);
          }
        } else if (input.B_release) {
          this.leaving[padIndex] = 0;
        }
      }
      padIndex += 1;
      return true;
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
