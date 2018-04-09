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
// whether the game is muted or not
let muted = false;
// the player character
let hero;
// container for all elements of the game
const gameContainer = new Container();
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
