// Aliases
var {
  Application, loader, sound, Text, Container, Graphics,
} = PIXI;
// const resources = PIXI.loader.resources;
// const Sprite = PIXI.Sprite;
// globals
var input = {
  left_x: 0,
  left_y: 0,
  right_x: 0,
  right_y: 0,
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
// color for background
var backgroundColor = 0x65635a;
// color for hero
var heroColor = 0xe1ddcf;
// color for texts
var textColor = 0xe1ddcf;
// color for bullets
var bulletColor = 0xf9efc7;
// color for enemies
var enemyColor = 0xe5b195;
// color for enemy bullets
var enemyBulletColor = 0xffb195;
// color for staggered enemies
var staggerColor = 0xffb195;
// color for markers
var markerColor = 0x00ffff;
// current gamestate
var state = 'load';
// whether the game is muted or not
var muted = false;
// text object
var t;
// container for all elements of the game
var gameContainer;
// the player character
var hero;
// Starting hp of the player
var heroHp = 3;
// Frames the player is invincible after getting hit
var heroInvincibility = 30;
// array of all player bullets
var bullets = [];
// array of all enemy bullets
var enemyBullets = []
// array of all enemies
var enemies = [];
// array of all hit markers
var markers = [];
// frames a marker is visible
var markerHp = 20;
// most pixels enemies can move per frame
var enemySpeed = 4;
// frames an enemy is staggered after getting hit
var enemyStagger = 5;
// amount of times enemy needs to be hit to die
var enemyHp = 10;
// enemy cooldown after shooting
var enemyBulletCooldown = 30;
// speed of enemy bullets
var enemyBulletSpeed = 3;
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
// SoundSprite
var shootSound;
// sprite information
var shootLongSprites = {
  'shoot1': { start: 0, end: 1 },
  'shoot2': { start: 2, end: 3 },
  'shoot3': { start: 4, end: 5 },
  'shoot4': { start: 6, end: 7 },
  'shoot5': { start: 8, end: 9 },
  'shoot6': { start: 10, end: 11 },
  'shoot7': { start: 12, end: 13 },
  'shoot8': { start: 14, end: 15 },
};
