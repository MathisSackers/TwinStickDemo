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

// detect whether a bullet touches an enemy
function hitScan() {
  // scan hero bullets first
  bullets.forEach((bullet) => {
    // bullet hit
    const b = bullet;
    if (b.visible) {
      enemyBullets.forEach((enemyBullet) => {
        if (enemyBullet.visible && b.visible) {
          const eb = enemyBullet;
          if (circleRectHit(enemyBullet, bullet)) {
            if (!muted) {
              // sound
            }
            b.visible = false;
            eb.visible = false;
          }
          return eb;
        }
        return enemyBullet;
      });
    }
    // enemy hit
    if (b.visible) {
      enemies.forEach((enemy) => {
        if (enemy.visible && b.visible) {
          const e = enemy;
          if (rectHit(enemy, bullet)) {
            if (!muted) {
              sound.play('opponentHit');
            }
            hitMarker(b);
            b.visible = false;
            e.hp -= 1;
            if (e.hp <= 0) {
              e.visible = false;
              return e;
            }
            e.stagger = enemyStagger;
            e.tint = staggerColor;
          }
          return e;
        }
        return enemy;
      });
      return b;
    }
    return bullet;
  });
}
