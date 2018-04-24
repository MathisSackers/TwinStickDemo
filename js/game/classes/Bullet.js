// The (hero-)bullet class

const BULLET_SPEED = 10;
const BULLET_COLOR = 0xf9efc7;

class Bullet {
  constructor(origin) {
    this.graphic = new Graphics();
    const { graphic } = this;
    graphic.beginFill(BULLET_COLOR);
    graphic.drawRect(0, 0, 6, 12);
    graphic.endFill();
    graphic.pivot.set(3, 25);
    graphic.speed = BULLET_SPEED;
    this.reset(origin);
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

  reset(newOrigin) {
    this.onScreen = true;
    const { graphic } = this;
    graphic.x = newOrigin.x;
    graphic.y = newOrigin.y;
    graphic.visible = true;
    graphic.rotation = newOrigin.rotation;
    graphic.dy = -Math.cos(graphic.rotation);
    graphic.dx = Math.sin(graphic.rotation);
  }

  collides(otherObj, shape) {
    switch (shape) {
      case 'circle':
        return circleRectHit(otherObj, this.graphic);
      case 'rectangle':
        return rectHit(otherObj, this.graphic);
      default:
        console.error(`Unknown shape: ${shape}`);
    }
    return false;
  }

  remove() {
    this.onScreen = false;
    this.graphic.visible = false;
  }
}

// moves visible bullets
function moveBullets(delta) {
  bullets.forEach((bullet) => {
    bullet.update(delta);
  });
}

// gets a bullet or creates a new one
function fire(origin) {
  let needNewBullet = true;
  bullets.forEach((bullet) => {
    if (needNewBullet && !bullet.onScreen) {
      bullet.reset(origin);
      needNewBullet = false;
    }
  });
  if (needNewBullet) {
    const bullet = new Bullet(origin);
    bullets.push(bullet);
    bulletContainer.addChild(bullet.graphic);
  }
}
