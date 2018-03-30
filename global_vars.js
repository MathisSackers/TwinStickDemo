// globals
var input = {
  ok_press: false,
  ok_down: false,
  ok_release: false,
  fire_press: false,
  fire_down: false,
  fire_release: false,
  pause_press: false,
  pause_down: false,
  pause_release: false,
};
var gamepad = {bindings: {}};
// color for foreground
var lightGrey = 0xe1ddcf;
// current gamestate
var state = 'load';
// text object
var t;
// container for all elements of the game
var gameContainer;
// the player character
var hero;
// array of all player bullets
var bullets = [];
// array of all enemies
var enemies = [];
// most pixels enemies can move per frame
var enemySpeed = 4;
// most pixels you can move per frame
var heroSpeed = 5;
// most pixels your bullet can move per frame
var heroBulletSpeed = 7;
// frames until you can shoot again
var heroBulletCooldown = 3;
// most rads you can turn per frame
var heroRotationSpeed = 0.2;
// when the next bullet is possible
var heroBulletCurrentCooldown = -1;