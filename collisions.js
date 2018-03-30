// adapted from https://github.com/kittykatattack/learningPixi#collision
function rectHit(rect1, rect2) {
  const r1 = rect1;
  const r2 = rect2;
  // Find the center points of each rectangle
  r1.centerX = r1.x + (r1.width / 2);
  r1.centerY = r1.y + (r1.height / 2);
  r2.centerX = r2.x + (r2.width / 2);
  r2.centerY = r2.y + (r2.height / 2);
  // Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  // Calculate the distance vector between the sprites
  const vx = r1.centerX - r2.centerX;
  const vy = r1.centerY - r2.centerY;
  // Figure out the combined half-widths and half-heights
  const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  const combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  // Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    // A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      // There's definitely a collision happening
      return true;
    }
  }
  return false;
}

// detect whether a bullet touches an enemy
function hitScan() {
  enemies.forEach((enemy) => {
    if (enemy.visible) {
      const e = enemy;
      bullets.forEach((bullet) => {
        if (bullet.visible) {
          if (rectHit(enemy, bullet)) {
            const b = bullet;
            hitMarker(b);
            b.visible = false;
            e.hp -= 1;
            if (e.hp <= 0) {
              e.visible = false;
            }
            return b;
          }
        }
        return bullet;
      });
      return e;
    }
    return enemy;
  });
}
