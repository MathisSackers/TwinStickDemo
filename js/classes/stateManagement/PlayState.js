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
    // check if all heroes are dead
    if (
      heroes.every(hero => !hero.onScreen)
    ) {
      game.statemachine.transition('DeathState');
    }
    // check if at least one hero is alive
    if (heroes.some(hero => hero.hp > 0)) {
      // update the level
      game.levelmachine.update(delta);
    }
    return this;
  }
}
