// calculating movement and rotation of entities

// this calculates the new position given the current one
function calculateMovement(object, bounds, delta) {
  let len = Math.sqrt((object.dx * object.dx) + (object.dy * object.dy));
  const point = { x: object.x, y: object.y };
  // if we're not too fast no need to slow us
  if (len < 1) {
    len = 1;
  }
  if (len !== 0) {
    point.x += (object.speed * object.dx * delta) / len;
    point.y += (object.speed * object.dy * delta) / len;
  }

  // check out of bounds
  point.x = Math.max(point.x, bounds);
  point.x = Math.min(point.x, window.innerWidth - bounds);
  point.y = Math.max(point.y, bounds);
  point.y = Math.min(point.y, window.innerHeight - bounds);
  return point;
}
