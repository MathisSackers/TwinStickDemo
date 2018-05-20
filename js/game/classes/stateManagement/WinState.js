// when the level has been cleared
class WinState extends State {
  constructor() {
    super();
    this.name = 'WinState';
    game.levelmachine.kill();
    setEntitiesInvisible();
    game.text.setText('You won - Hit A to try again.');
    game.text.show();
  }
  update() {
    game.usedPads.forEach((pad) => {
      const input = GamepadUtil.getInput(pad);
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
