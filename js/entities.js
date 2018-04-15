// Does entity manipulation on a larger scale

// sets everything invisible
function setEntitiesInvisible() {
  enemies.forEach((enemy) => {
    enemy.remove();
  });
  markers.forEach((marker) => {
    marker.remove();
  });
  enemyBullets.forEach((bullet) => {
    bullet.remove();
  });
  bullets.forEach((bullet) => {
    bullet.remove();
  });
  heroes.forEach((hero) => {
    hero.remove();
  });
}
