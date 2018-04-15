// handles all collision checks and their effects

// adapted from https://github.com/kittykatattack/learningPixi#collision
function rectHit(rect1, rect2) {
  const r1 = rect1;
  const r2 = rect2;
  // Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  // Calculate the distance vector between the sprites
  const vx = r1.x - r2.x;
  const vy = r1.y - r2.y;
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

// generous detection between circle and rect, because (heroes) bullets might rotate and stuff :S
function circleRectHit(circle, rectangle) {
  const distanceX = circle.x - rectangle.x;
  const distanceY = circle.y - rectangle.y;
  const distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
  if (distance < (circle.width / 2) + (rectangle.height / 2)) {
    return true;
  }
  return false;
}

// whether to circles collide
function circleHit(c1, c2) {
  const distanceX = c1.x - c2.x;
  const distanceY = c1.y - c2.y;
  const distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
  if (distance < (c1.width / 2) + (c2.width / 2)) {
    return true;
  }
  return false;
}

// detect whether a bullet touches an enemy
function hitScan() {
  // scan hero bullets first
  bullets.forEach((bullet) => {
    // bullet hit
    if (bullet.onScreen) {
      enemyBullets.forEach((enemyBullet) => {
        if (enemyBullet.onScreen && bullet.onScreen && bullet.collides(enemyBullet.graphic, 'circle')) {
          if (!muted) {
            // sound
          }
          bullet.remove();
          enemyBullet.remove();
        }
      });
    }
    // enemy hit
    if (bullet.onScreen) {
      enemies.forEach((enemy) => {
        if (enemy.onScreen && bullet.onScreen && bullet.collides(enemy.graphic, 'rectangle')) {
          hitMarker(bullet);
          bullet.remove();
          enemy.hit(1);
        }
      });
    }
  });
  // hit by bullet
  enemyBullets.forEach((enemyBullet) => {
    heroes.forEach((hero) => {
      if (enemyBullet.onScreen && hero.invincible === 0 && enemyBullet.collides(hero.graphic, 'circle')) {
        hero.hit();
        enemyBullet.remove();
      }
    });
  });
  // hit by enemy
  enemies.forEach((enemy) => {
    heroes.forEach((hero) => {
      if (enemy.onScreen) {
        if (enemy.collides(hero.graphic, 'circle')) {
          hero.hit();
        }
      }
    });
  });
}
