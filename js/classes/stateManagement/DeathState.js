// when all heroes have died
class DeathState extends State {
  constructor() {
    super();
    this.name = 'DeathState';
    setEntitiesInvisible();
    game.text.setText('Hit A to try again.');
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
