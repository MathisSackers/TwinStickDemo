// before playing the game, to bind(/calibrate) the gamepads
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
      // needs binding
      if (!game.usedPads.includes(connectedPad)) {
        // get input
        const bindIn = bindControls(connectedPad);
        if (bindIn === true) {
          game.usedPads.push(connectedPad);
        } else if (bindIn !== false) {
          game.text.setText(bindIn, counter);
        }
      } else {
        // already bound
        game.text.setText('Press A to start the game.', counter);
        const input = getInput(connectedPad);
        if (input.A_press) {
          // start game
          game.statemachine.transition('PlayState');
        }
      }
      counter += 1;
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
