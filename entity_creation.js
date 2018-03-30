// handles creation of bullets, enemies and the player

// create bullet
function createBullet() {
  const bullet = new Graphics();
  bullet.beginFill(bulletColor);
  bullet.drawRect(0, 0, 6, 12);
  bullet.endFill();
  bullet.pivot.set(3, 25);
  bullet.x = hero.x;
  bullet.y = hero.y;
  bullet.rotation = hero.rotation;
  bullet.dy = -Math.cos(bullet.rotation);
  bullet.dx = Math.sin(bullet.rotation);
  bullets.push(bullet);
  gameContainer.addChild(bullet);
}

// gets a bullet or creates a new one
function fire() {
  let needNewBullet = true;
  bullets.forEach((bullet) => {
    if (needNewBullet && !bullet.visible) {
      const s = bullet;
      s.x = hero.x;
      s.y = hero.y;
      s.rotation = hero.rotation;
      s.dy = -Math.cos(s.rotation);
      s.dx = Math.sin(s.rotation);
      s.visible = true;
      needNewBullet = false;
      return s;
    }
    return bullet;
  });
  if (needNewBullet) {
    createBullet();
  }
}

// create an Enemy
function createEnemy() {
  const enemy = new Graphics();
  enemy.beginFill(enemyColor);
  enemy.drawRect(0, 0, 50, 50);
  enemy.endFill();
  enemy.pivot.set(25, 25);
  enemy.x = Math.random() * window.innerWidth;
  enemy.y = -enemy.height;
  enemy.hp = enemyHp;
  enemy.bulletCooldown = enemyBulletCooldown * 2;
  enemy.stagger = 0;
  enemies.push(enemy);
  gameContainer.addChild(enemy);
}

// gets an enemy or creates a new one
function spawnEnemy() {
  let needNewEnemy = true;
  enemies.forEach((enemy) => {
    if (needNewEnemy && !enemy.visible) {
      const e = enemy;
      e.x = Math.random() * window.innerWidth;
      e.y = -e.height;
      e.hp = enemyHp;
      e.bulletCooldown = enemyBulletCooldown * 2;
      e.visible = true;
      e.stagger = 0;
      e.tint = 0xffffff;
      needNewEnemy = false;
      return e;
    }
    return enemy;
  });
  if (needNewEnemy) {
    createEnemy();
  }
}

// This function creates the graphic for the hero
function createHero() {
  hero = new Graphics();
  hero.beginFill(heroColor);

  hero.drawPolygon([-15, 50, 15, 50, 0, 0]);
  hero.endFill();


  hero.x = window.innerWidth / 2;
  hero.y = window.innerHeight / 2;

  hero.pivot.set(0, 25);
}

// creates a marker
function createHitMarker(bullet) {
  const marker = new Graphics();
  marker.lineStyle(3, markerColor, 1);
  marker.drawRect(0, 0, 100, 100);
  marker.pivot.set(50, 50);
  marker.size = 0.5 + (0.5 * Math.random());
  marker.scale.set(marker.size);
  marker.x = bullet.x;
  marker.y = bullet.y;
  marker.rotation = Math.random() * Math.PI;
  marker.hp = markerHp;
  markers.push(marker);
  gameContainer.addChild(marker);
}

// gets a marker or creates a new one
function hitMarker(bullet) {
  let needNewMarker = true;
  markers.forEach((marker) => {
    if (needNewMarker && !marker.visible) {
      const m = marker;
      m.x = bullet.x;
      m.y = bullet.y;
      m.rotation = Math.random() * Math.PI;
      m.hp = markerHp;
      m.size = 0.5 + (0.5 * Math.random());
      m.scale.set(m.size);
      m.visible = true;
      needNewMarker = false;
      return m;
    }
    return marker;
  });
  if (needNewMarker) {
    createHitMarker(bullet);
  }
}

// creates an enemy bullet
function createEnemyBullet(enemy) {
  const bullet = new Graphics();
  bullet.beginFill(enemyBulletColor);
  bullet.drawCircle(0, 0, 30);
  bullet.endFill();
  bullet.pivot.set(0, 0);
  bullet.x = enemy.x;
  bullet.y = enemy.y;
  const offDegrees = -0.2 + (Math.random() * 0.4);
  const heroDirection = Math.atan2(hero.x - enemy.x, hero.y - enemy.y) + offDegrees;
  const direction = (Math.random() < 0.4) ? heroDirection : Math.random() * 2 * Math.PI;
  bullet.dy = Math.cos(direction);
  bullet.dx = Math.sin(direction);
  enemyBullets.push(bullet);
  gameContainer.addChild(bullet);
}

// gets or creates an enemy bullet
function enemyBullet(enemy) {
  let needNewBullet = true;
  enemyBullets.forEach((bullet) => {
    if (needNewBullet && !bullet.visible) {
      const b = bullet;
      b.x = enemy.x;
      b.y = enemy.y;
      const offDegrees = -0.2 + (Math.random() * 0.4);
      const heroDirection = Math.atan2(hero.x - enemy.x, hero.y - enemy.y) + offDegrees;
      const direction = (Math.random() < 0.4) ?
        heroDirection : Math.random() * 2 * Math.PI;
      b.dy = Math.cos(direction);
      b.dx = Math.sin(direction);
      b.visible = true;
      needNewBullet = false;
      return b;
    }
    return bullet;
  });
  if (needNewBullet) {
    createEnemyBullet(enemy);
  }
}

// determines enemies that should fire
function enemiesFire(delta) {
  enemies.forEach((enemy) => {
    const e = enemy;
    if (e.visible && enemy.stagger === 0) {
      e.bulletCooldown -= delta;
      if (e.bulletCooldown < 0) {
        enemyBullet(e);
        if (!muted) {
          // sound
        }
        e.bulletCooldown += enemyBulletCooldown;
      }
    }
    return e;
  });
}
