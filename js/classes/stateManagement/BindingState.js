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
