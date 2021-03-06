// The Hero class

// entity parameters
// Starting hp of the player
const H_HP = 3;
// Frames the player is invincible after getting hit
const H_INVINCIBILITY = 30;
// most pixels you can move per frame
const H_SPEED = 5;
// frames until you can shoot again
const H_BULLET_COOLDOWN = 3;
// most rads you can turn per frame
const H_ROTATION_SPEED = 0.2;
// color for heroes
const H_COLOR = 0xe1ddcf;
// different tints for heroes 1 - 4
const H_TINTS = [0xb2cfff, 0x92ea8f, 0xdc8fef, 0xf7dc65];

// This function calculates the rotation given x and y input and the
// current rotation
function calculateRotation(x, y, curr, speed) {
  // thats the desired rotation
  let goal = Math.atan2(x, y);
  // 0 at top, pi/2 on right, pi at bottom and -pi/2 on left
  const pi = Math.PI;
  // goal distance from top
  let goalDistance = Math.abs(goal);
  if (goal < 0) {
    goalDistance = (2 * pi) + goal;
  }
  // hero.rotation distance from top
  let heroDistance = Math.abs(curr);
  if (curr < 0) {
    heroDistance = (2 * pi) + curr;
  }
  // distance between the two
  const heroGoalDistance = Math.abs(goal - curr);
  // if the distance is too big
  if (heroGoalDistance > speed && heroGoalDistance < (2 * pi) - speed) {
    if (Math.abs(heroDistance - goalDistance) < pi) {
      if (heroDistance < goalDistance) {
        // turn right
        goal = curr + speed;
      } else {
        // turn left
        goal = curr - speed;
      }
    } else if (heroDistance > goalDistance) {
      // turn right
      goal = curr + speed;
    } else {
      // turn left
      goal = curr - speed;
    }
  }
  // fix if we went over the limit
  if (goal > pi) {
    goal -= 2 * pi;
  } else if (goal < -pi) {
    goal += 2 * pi;
  }
  return goal;
}

class Hero {
  constructor(index, totalHeroes) {
    this.graphic = new Graphics();
    const { graphic } = this;
    graphic.beginFill(H_COLOR);
    graphic.drawPolygon([-15, 50, 15, 50, 0, 0]);
    graphic.endFill();
    graphic.pivot.set(0, 25);
    graphic.speed = H_SPEED;
    graphic.filterArea = game.filterArea;
    this.reset(index, totalHeroes);
  }

  update(input, delta) {
    if (this.onScreen) {
      if (this.hp > 0) {
        // shooting
        this.bulletCooldown -= delta;
        if (this.bulletCooldown < -1) {
          this.bulletCooldown = -(Math.abs(this.bulletCooldown) % 1);
        }
        // life
        if (this.invincible > 0) {
          const pct = (H_INVINCIBILITY - this.invincible) / H_INVINCIBILITY;
          const distortion =
            (0.05952381 + (7.259921 * pct) + (6.597222 * pct * pct * pct)) - (13.86905 * pct * pct);
          const x = Math.sin(this.glitchDirection);
          const y = Math.cos(this.glitchDirection);
          this.graphic.filters = [new PIXI.filters.GlitchFilter({
            offset: 50,
            blue: [distortion * 50 * x, distortion * 5 * y],
            red: [-distortion * 20 * x, -distortion * 50 * y],
            green: [distortion * 20 * x, -distortion * 5 * y],
          })];
          this.invincible -= delta;
          this.invincible = this.invincible <= 0 ? 0 : this.invincible;
        }
        if (this.invincible === 0) {
          this.invincible = -1;
          this.glitchDirection = Math.random() * 2 * Math.PI;
          this.graphic.filters = null;
        }
        // input
        this.inputHandling(input, delta);
      } else {
        this.die();
      }
    }
  }

  inputHandling(input, delta) {
    // shooting
    if (input.R1_down) {
      if (this.bulletCooldown < 0) {
        fire(this.graphic);
        if (!muted) {
          shootSound.play(`shoot${Math.ceil(Math.random() * 8)}`);
        }
        this.bulletCooldown += H_BULLET_COOLDOWN;
      }
    }
    const { graphic } = this;
    // Movement
    graphic.dx = input.left_x;
    graphic.dy = input.left_y;
    const move = calculateMovement(
      graphic,
      graphic.height,
      delta,
    );
    graphic.x = move.x;
    graphic.y = move.y;
    // Roatation
    if (Math.abs(input.right_y) > 0.5 || Math.abs(input.right_x) > 0.5) {
      // amount we can rotate _this_ frame
      const speed = H_ROTATION_SPEED * delta;
      graphic.rotation = calculateRotation(input.right_x, -input.right_y, graphic.rotation, speed);
    }
  }

  reset(index, totalHeroes) {
    this.onScreen = true;
    this.hp = H_HP;
    this.bulletCooldown = -1;
    this.invincible = 0;
    const { graphic } = this;
    graphic.tint = H_TINTS[index];
    graphic.x = game.WIDTH / 2;
    graphic.y = game.HEIGHT / 2;
    if (totalHeroes > 1) {
      if (totalHeroes === 3) {
        if (index === 0) {
          graphic.y -= graphic.height;
        } else {
          graphic.y += graphic.height;
          if (index === 1) {
            graphic.x += graphic.width;
          } else {
            graphic.x -= graphic.width;
          }
        }
      } else {
        // 2 or 4
        if (index % 2 === 0) {
          graphic.x -= graphic.width;
        } else {
          graphic.x += graphic.width;
        }
        if (totalHeroes === 4) {
          if (index < 2) {
            graphic.y -= graphic.height;
          } else {
            graphic.y += graphic.height;
          }
        }
      }
    }
    graphic.rotation = 0;
    graphic.scale.set(1);
    graphic.visible = true;
    graphic.filters = null;
  }

  hit(damage = 1) {
    if (this.invincible <= 0) {
      if (!muted) {
        sound.play('heroHit');
      }
      this.hp -= damage;
      this.invincible = H_INVINCIBILITY;
    }
  }

  die() {
    this.hp -= 1;
    this.graphic.scale.set(1 + (this.hp / 60));
    if (this.hp < -60) {
      this.remove();
    }
  }

  remove() {
    this.onScreen = false;
    this.graphic.visible = false;
  }

  screenResize() {
    this.graphic.filterArea = game.filterArea;
  }
}


// This function creates the graphic for the hero
function createHeroes(num = 1) {
  for (let i = 0; i < num; i += 1) {
    if (heroes[i] === undefined) {
      heroes[i] = new Hero(i, num);
      heroContainer.addChild(heroes[i].graphic);
    } else {
      heroes[i].reset(i, num);
    }
  }
  while (heroes.length > num) {
    heroContainer.removeChild(heroes[heroes.length].graphic);
    heroes.pop();
  }
}
