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
function handleMovementAndRotation(delta) {
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
  const s = bullet;
  const p = calculateMovement(s.x, s.y, -2 * s.height, s.dx, s.dy, delta * heroBulletSpeed);
  s.x = p.x;
  s.y = p.y;
  if (
    s.x < -s.height || s.x > window.innerWidth + s.height ||
    s.y < -s.height || s.y > window.innerHeight + s.height
  ) {
    s.visible = false;
  }
  return s;
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

// moves single enemy
function moveEnemy(enemy, delta) {
  const s = enemy;
  const p = calculateMovement(s.x, s.y, -2 * s.height, s.dx, s.dy, delta * enemySpeed);
  s.x = p.x;
  s.y = p.y;
  if (
    s.x < -s.height || s.x > window.innerWidth + s.height ||
    s.y < -s.height || s.y > window.innerHeight + s.height
  ) {
    s.visible = false;
  }
  return s;
}

// moves visible enemies
function moveEnemies(delta) {
  enemies.forEach((enemy) => {
    if (enemy.visible) {
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
