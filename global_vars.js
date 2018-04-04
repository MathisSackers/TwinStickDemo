// Aliases
// Alias
const {
  Application,
  Container,
  Graphics,
  loader,
  sound,
  Text,
} = PIXI;

// globals
// color for background
const backgroundColor = 0x65635a;
// color for hero
const heroColor = 0xe1ddcf;
// color for texts
const textColor = 0xe1ddcf;
// color for bullets
const bulletColor = 0xf9efc7;
// color for enemies
const enemyColor = 0xe5b195;
// color for enemy bullets
const enemyBulletColor = 0xffb195;
// color for staggered enemies
const staggerColor = 0xffb195;
// color for markers
const markerColor = 0x00ffff;
// whether the game is muted or not
let muted = false;
// the player character
let hero;
// array of all player bullets
const bullets = [];
// array of all enemy bullets
const enemyBullets = [];
// array of all enemies
const enemies = [];
// array of all hit markers
const markers = [];
// SoundSprite
let shootSound;
// sprite information
const shootLongSprites = {
  shoot1: { start: 0, end: 1 },
  shoot2: { start: 2, end: 3 },
  shoot3: { start: 4, end: 5 },
  shoot4: { start: 6, end: 7 },
  shoot5: { start: 8, end: 9 },
  shoot6: { start: 10, end: 11 },
  shoot7: { start: 12, end: 13 },
  shoot8: { start: 14, end: 15 },
};
