// The hitmarker class

// entity parameters
// frames a marker is visible
const MARKER_HP = 50;
const MARKER_COLOR = 0x00ffff;

class HitMarker {
  constructor(origin) {
    this.graphic = new Graphics();
    const { graphic } = this;
    graphic.lineStyle(3, MARKER_COLOR, 1);
    graphic.drawRect(0, 0, 100, 100);
    graphic.pivot.set(50, 50);
    this.reset(origin);
  }

  update() {
    if (this.onScreen) {
      this.hp -= 1;
      const { graphic } = this;
      if (this.hp % 10 === 0) {
        graphic.rotation += 0.8;
        this.size /= 2;
        graphic.scale.set(this.size);
      }
      graphic.alpha -= 1.5 / MARKER_HP;
      if (this.hp < 0) {
        this.remove();
      }
    }
  }

  reset(newOrigin) {
    this.onScreen = true;
    this.hp = MARKER_HP;
    this.size = 0.5 + (0.5 * Math.random());
    const { graphic } = this;
    graphic.x = newOrigin.x;
    graphic.y = newOrigin.y;
    graphic.visible = true;
    graphic.alpha = 1;
    graphic.rotation = Math.random() * Math.PI;
    graphic.scale.set(this.size);
  }

  remove() {
    this.graphic.visible = false;
    this.onScreen = false;
  }
}

// rotates visible markers
function moveHitMarkers() {
  markers.forEach((marker) => {
    marker.update();
  });
}

// gets a marker or creates a new one
function hitMarker(bullet) {
  let needNewMarker = true;
  markers.forEach((marker) => {
    if (needNewMarker && !marker.onScreen) {
      marker.reset(bullet.graphic);
      needNewMarker = false;
    }
    return marker;
  });
  if (needNewMarker) {
    const marker = new HitMarker(bullet.graphic);
    markers.push(marker);
    hitMarkerContainer.addChild(marker.graphic);
  }
}
