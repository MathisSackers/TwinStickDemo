// Aliases
var {
  Application, loader, sound, Text, Container, Graphics,
} = PIXI;
// const resources = PIXI.loader.resources;
// const Sprite = PIXI.Sprite;
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
// color for staggered enemies
var staggerColor = 0xffb195;
// color for markers
var markerColor = 0x00ffff;
// current gamestate
var state = 'load';
// whether the game is muted or not
var muted = true;
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