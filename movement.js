// this calculates the new position given the current one
function calculateMovement(currx, curry, bounds, x, y, speed) {
  let len = Math.sqrt((x * x) + (y * y));
  const point = { x: currx, y: curry };
  // if we're not too fast no need to slow us
  if (len < 1) {
    len = 1;
  }
  if (len !== 0) {
    point.x += (speed * x) / len;
    point.y += (speed * y) / len;
  }

  // check out of bounds
  point.x = Math.max(point.x, bounds);
  point.x = Math.min(point.x, window.innerWidth - bounds);
  point.y = Math.max(point.y, bounds);
  point.y = Math.min(point.y, window.innerHeight - bounds);
  return point;
}

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

// Moves and rotates hero depending on input
function handleMovementAndRotation(input, delta) {
  // Movement
  const move = calculateMovement(
    hero.x, hero.y,
    hero.height,
    input.left_x, input.left_y,
    delta * heroSpeed,
  );
  hero.x = move.x;
  hero.y = move.y;
  // Roatation
  if (Math.abs(input.right_y) > 0.5 || Math.abs(input.right_x) > 0.5) {
    // amount we can rotate _this_ frame
    const speed = heroRotationSpeed * delta;
    hero.rotation = calculateRotation(input.right_x, -input.right_y, hero.rotation, speed);
  }
}

// moves single bullet
function moveBullet(bullet, delta) {
  const b = bullet;
  const p = calculateMovement(b.x, b.y, -2 * b.height, b.dx, b.dy, delta * heroBulletSpeed);
  b.x = p.x;
  b.y = p.y;
  if (
    b.x < -b.height || b.x > window.innerWidth + b.height ||
    b.y < -b.height || b.y > window.innerHeight + b.height
  ) {
    b.visible = false;
  }
  return b;
}

// moves visible bullets
function moveBullets(delta) {
  bullets.forEach((bullet) => {
    if (bullet.visible) {
      return moveBullet(bullet, delta);
    }
    return bullet;
  });
}


function updateGoal(enemy) {
  const e = enemy;
  const fifthOfScreenW = window.innerWidth / 5;
  const fifthOfScreenH = window.innerHeight / 5;
  e.goalX = fifthOfScreenW + (Math.random() * fifthOfScreenW * 3);
  e.goalY = fifthOfScreenH + (Math.random() * fifthOfScreenH * 3);
  return e;
}

// updates the desired direction of the enemy
function updateDirection(enemy) {
  let e = enemy;
  if (
    e.goalX === undefined ||
    (Math.abs(e.x - e.goalX) < 20 && Math.abs(e.y - e.goalY) < 20) ||
    (Math.abs(hero.x - e.goalX) < 30 && Math.abs(hero.y - e.goalY) < 30)
  ) {
    e = updateGoal(e);
  }
  let goalX = (e.x < e.goalX) ? 1 : -1;
  let goalY = (e.y < e.goalY) ? 1 : -1;
  if (Math.abs(e.x - e.goalX) < 300) {
    goalX *= (Math.abs(e.x - e.goalX) / 300);
  }
  if (Math.abs(e.y - e.goalY) < 300) {
    goalY *= (Math.abs(e.y - e.goalY) / 300);
  }
  e.dx = goalX;
  e.dy = goalY;
  // avoid hero
  const distToHeroX = Math.abs(e.x - hero.x);
  const distToHeroY = Math.abs(e.y - hero.y);
  const distToHero = Math.sqrt((distToHeroX * distToHeroX) + (distToHeroY * distToHeroY));
  if (distToHero < 300) {
    let heroX = (e.x < hero.x) ? -1 : 1;
    let heroY = (e.y < hero.y) ? -1 : 1;
    heroX *= 1 - (Math.abs(e.x - hero.x) / 300);
    heroY *= 1 - (Math.abs(e.y - hero.y) / 300);
    e.dx += heroX;
    e.dy += heroY;
  }
  return e;
}


// moves single enemy
function moveEnemy(enemy, delta) {
  const e = updateDirection(enemy);
  const p = calculateMovement(e.x, e.y, -2 * e.height, e.dx, e.dy, delta * enemySpeed);
  e.x = p.x;
  e.y = p.y;
  if (
    e.x < -e.height || e.x > window.innerWidth + e.height ||
    e.y < -e.height || e.y > window.innerHeight + e.height
  ) {
    e.visible = false;
  }
  return e;
}

// moves visible enemies
function moveEnemies(delta) {
  enemies.forEach((enemy) => {
    if (enemy.visible) {
      if (enemy.stagger > 1) {
        const e = enemy;
        e.stagger -= 1;
        return e;
      }
      if (enemy.stagger === 1) {
        const e = enemy;
        e.stagger = 0;
        e.tint = 0xffffff;
        return e;
      }
      return moveEnemy(enemy, delta);
    }
    return enemy;
  });
}

// rotates a marker
function moveMarker(marker) {
  const m = marker;
  m.hp -= 1;
  if (m.hp % 10 === 0) {
    m.rotation += 0.8;
    m.size /= 2;
    m.scale.set(m.size);
  }
  m.alpha -= 1.5 / markerHp;
  if (m.hp < 0) {
    m.alpha = 1;
    m.size = 1;
    m.scale.set(m.size);
    m.visible = false;
  }
  return m;
}

// rotates visible markers
function moveHitMarkers() {
  markers.forEach((marker) => {
    if (marker.visible) {
      return moveMarker(marker);
    }
    return marker;
  });
}

// moves a single enemy bullet
function moveEnemyBullet(bullet, delta) {
  const b = bullet;
  const p = calculateMovement(b.x, b.y, -2 * b.height, b.dx, b.dy, delta * enemyBulletSpeed);
  b.x = p.x;
  b.y = p.y;
  if (
    b.x < -b.height || b.x > window.innerWidth + b.height ||
    b.y < -b.height || b.y > window.innerHeight + b.height
  ) {
    b.visible = false;
  }
  return b;
}

// moves visible enemy bullets
function moveEnemyBullets(delta) {
  enemyBullets.forEach((bullet) => {
    if (bullet.visible) {
      return moveEnemyBullet(bullet, delta);
    }
    return bullet;
  });
}
