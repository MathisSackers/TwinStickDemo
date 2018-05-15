// The enemy class

// entity parameters
const E_SPEED = 4;
// frames an enemy is staggered after getting hit
const E_STAGGER = 5;
// amount of times enemy needs to be hit to die
const E_HP = 10;
// enemy cooldown after shooting
const E_BULLET_COOLDOWN = 30;
// color for enemies
const E_COLOR = 0xe5b195;
// color for staggered enemies
const E_STAGGER_COLOR = 0xffb195;

// generates a goal point somewhere on screen
function getGoal() {
  const p = {};
  const fifthOfScreenW = game.WIDTH / 5;
  const fifthOfScreenH = game.HEIGHT / 5;
  p.x = fifthOfScreenW + (Math.random() * fifthOfScreenW * 3);
  p.y = fifthOfScreenH + (Math.random() * fifthOfScreenH * 3);
  return p;
}

class Enemy {
  constructor() {
    this.graphic = new Graphics();
    const { graphic } = this;
    graphic.beginFill(E_COLOR);
    graphic.drawRect(0, 0, 50, 50);
    graphic.endFill();
    graphic.pivot.set(25, 25);
    graphic.speed = E_SPEED;
    this.reset();
  }

  hit(damage) {
    if (!muted) {
      sound.play('opponentHit');
    }
    this.hp -= damage;
    if (this.hp <= 0) {
      this.remove();
      return;
    }
    this.stagger = E_STAGGER;
    this.graphic.tint = E_STAGGER_COLOR;
  }

  update(delta) {
    if (this.onScreen) {
      const { graphic } = this;
      // stagger
      if (this.stagger > 0) {
        this.stagger -= delta;
        if (this.stagger <= 0) {
          graphic.tint = 0xffffff;
          this.stagger = 0;
        }
      }
      if (this.stagger === 0) {
        // fire
        this.bulletCooldown -= delta;
        if (this.bulletCooldown < 0) {
          this.fire();
          this.bulletCooldown += E_BULLET_COOLDOWN;
        }
        // move
        this.updateDirection();
        const p = calculateMovement(graphic, -2 * graphic.height, delta);
        graphic.x = p.x;
        graphic.y = p.y;
        if (
          graphic.x < -graphic.height || graphic.x > game.WIDTH + graphic.height
          || graphic.y < -graphic.height || graphic.y > game.HEIGHT + graphic.height
        ) {
          this.remove();
        }
      }
    }
  }

  updateDirection() {
    const { graphic } = this;
    heroes.forEach((hero) => {
      if (
        this.goal.x === undefined
        || (Math.abs(graphic.x - this.goal.x) < 20
          && Math.abs(graphic.y - this.goal.y) < 20)
        || (Math.abs(hero.graphic.x - this.goal.x) < 30
          && Math.abs(hero.graphic.y - this.goal.y) < 30)
      ) {
        this.goal = getGoal();
      }
    });
    // desire to move to the goal
    let goalX = (graphic.x < this.goal.x) ? 1 : -1;
    let goalY = (graphic.y < this.goal.y) ? 1 : -1;
    if (Math.abs(graphic.x - this.goal.x) < 300) {
      goalX *= (Math.abs(graphic.x - this.goal.x) / 300);
    }
    if (Math.abs(graphic.y - this.goal.y) < 300) {
      goalY *= (Math.abs(graphic.y - this.goal.y) / 300);
    }
    graphic.dx = goalX;
    graphic.dy = goalY;
    // avoid heroes
    heroes.some((hero) => {
      const distToHeroX = Math.abs(graphic.x - hero.graphic.x);
      const distToHeroY = Math.abs(graphic.y - hero.graphic.y);
      const distToHero = Math.sqrt((distToHeroX * distToHeroX) + (distToHeroY * distToHeroY));
      if (distToHero < 300) {
        let heroX = (graphic.x < hero.graphic.x) ? -1 : 1;
        let heroY = (graphic.y < hero.graphic.y) ? -1 : 1;
        heroX *= 1 - (Math.abs(graphic.x - hero.graphic.x) / 300);
        heroY *= 1 - (Math.abs(graphic.y - hero.graphic.y) / 300);
        graphic.dx += heroX;
        graphic.dy += heroY;
        return true;
      }
      return false;
    });
  }

  fire() {
    const target = Math.floor(Math.random() * heroes.length);
    enemyFire(this.graphic, heroes[target].graphic);
    if (!muted) {
      // sound
    }
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

  reset() {
    this.onScreen = true;
    this.bulletCooldown = E_BULLET_COOLDOWN * 2;
    this.hp = E_HP;
    this.stagger = 0;
    this.goal = getGoal();
    const { graphic } = this;
    graphic.x = Math.random() * game.WIDTH;
    graphic.y = -graphic.height;
    graphic.tint = 0xffffff;
    graphic.visible = true;
  }

  remove() {
    this.onScreen = false;
    this.graphic.visible = false;
  }
}

// moves visible enemies
function updateEnemies(delta) {
  enemies.forEach((enemy) => {
    enemy.update(delta);
  });
}

// gets an enemy or creates a new one
function spawnEnemy() {
  let newEnemy = null;
  enemies.some((enemy) => {
    if (newEnemy === null && !enemy.onScreen) {
      enemy.reset();
      newEnemy = enemy;
      return true;
    }
    return false;
  });
  if (newEnemy === null) {
    newEnemy = new Enemy();
    enemies.push(newEnemy);
    enemyContainer.addChild(newEnemy.graphic);
  }
  return newEnemy;
}
