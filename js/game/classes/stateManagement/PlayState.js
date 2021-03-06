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
      const input = GamepadUtil.getInput(pad);
      // global inputs
      // pause
      if (input.B_press) {
        game.statemachine.transition('PauseState');
      }
      // toggle objective box minimization
      if (input.A_press) {
        game.minimizedObjectives = !game.minimizedObjectives;
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
    // check if all heroes are dead
    if (
      heroes.every(hero => !hero.onScreen)
    ) {
      game.statemachine.transition('DeathState');
    }
    let hAlive = 0;
    heroes.forEach((hero) => { hAlive += hero.onScreen ? 1 : 0; });
    game.levelmachine.variables.playernum = hAlive;
    // check if at least one hero is alive
    if (heroes.some(hero => hero.hp > 0)) {
      // update the level
      game.levelmachine.update(delta);
    }
    return this;
  }
}
