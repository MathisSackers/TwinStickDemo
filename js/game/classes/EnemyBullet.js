// The enemy-bullet class

// entity parameters
// speed of enemy bullets
const E_BULLET_SPEED = 3;
// color for enemy bullets
const E_BULLET_COLOR = 0xffb195;

class EnemyBullet {
  constructor(origin, target) {
    this.graphic = new Graphics();
    const { graphic } = this;
    graphic.beginFill(E_BULLET_COLOR);
    graphic.drawCircle(0, 0, 30);
    graphic.endFill();
    graphic.speed = E_BULLET_SPEED;
    this.reset(origin, target);
  }

  update(delta) {
    if (this.onScreen) {
      const { graphic } = this;
      const p = calculateMovement(graphic, -2 * graphic.height, delta);
      graphic.x = p.x;
      graphic.y = p.y;
      if (
        graphic.x < -graphic.height || graphic.x > window.innerWidth + graphic.height
        || graphic.y < -graphic.height || graphic.y > window.innerHeight + graphic.height
      ) {
        this.remove();
      }
    }
  }

  reset(newOrigin, newTarget) {
    this.onScreen = true;
    const { graphic } = this;
    graphic.x = newOrigin.x;
    graphic.y = newOrigin.y;
    const offDegrees = -0.2 + (Math.random() * 0.4);
    const targetDirection = Math.atan2(
      newTarget.x - newOrigin.x,
      newTarget.y - newOrigin.y,
    ) + offDegrees;
    const direction = (Math.random() < 0.4) ? targetDirection : Math.random() * 2 * Math.PI;
    graphic.dy = Math.cos(direction);
    graphic.dx = Math.sin(direction);
    graphic.visible = true;
  }

  collides(otherObj, shape) {
    if (shape === 'circle') {
      return circleHit(otherObj, this.graphic);
    } else if (shape === 'rectangle') {
      return circleRectHit(this.graphic, otherObj);
    }
    return false;
  }

  remove() {
    this.onScreen = false;
    this.graphic.visible = false;
  }
}

// moves visible enemy bullets
function moveEnemyBullets(delta) {
  enemyBullets.forEach((bullet) => {
    bullet.update(delta);
  });
}

// gets or creates an enemy bullet
function enemyFire(enemy, target) {
  let needNewBullet = true;
  enemyBullets.forEach((bullet) => {
    if (needNewBullet && !bullet.onScreen) {
      bullet.reset(enemy, target);
      needNewBullet = false;
    }
  });
  if (needNewBullet) {
    const bullet = new EnemyBullet(enemy, target);
    enemyBullets.push(bullet);
    enemyBulletContainer.addChild(bullet.graphic);
  }
}
