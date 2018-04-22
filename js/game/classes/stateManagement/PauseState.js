// when the game is paused (duh!)
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
      const input = GamepadUtil.getInput(pad);
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
