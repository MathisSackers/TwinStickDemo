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
  enemy.x = Math.random() * window.innerWidth;
  enemy.y = -10;
  enemy.dy = Math.random() * 5;
  enemy.dx = -5 + (Math.random() * 10);
  enemy.hp = enemyHp;
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
      e.y = -10;
      e.dy = Math.random() * 5;
      e.dx = -5 + (Math.random() * 10);
      e.hp = enemyHp;
      e.visible = true;
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

// gets a marker
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
