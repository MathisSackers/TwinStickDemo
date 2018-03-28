//Aliases
let Application = PIXI.Application,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite,
Text = PIXI.Text,
Graphics = PIXI.Graphics;

//Create a Pixi Application
let app = new Application({
	width: 1,
	height: 1,
	antialias: true,
	transparent: false,
	resolution: 1
});
// Fit to screen
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// Set the background dark grey
app.renderer.backgroundColor = 0x222222;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


const light_grey = 0xaaaaaa;

var state = 'load';

//load the images and run the 'setup' function when it's done
loader
.add([]) // nothing to load yet
.load(setup);

var t;
var hero;
var gamepad = {};
gamepad.bindings = {};

//This setup function will run when the images have loaded
function setup() {
	// create hero
	createHero();
	app.stage.addChild(hero);
	
	t = new Text("axes");
	app.stage.addChild(t);

	state = 'control';

	// start the gameloop
	app.ticker.add(delta => gameLoop(delta));
}


function gameLoop(delta) {
	if (state === 'control') {
		// get input
		if (bindControls()) {
			state = 'play';
			t.visible = false;
			hero.visible = true;
		}
	} else if (state === 'play') {
		let input = getInput();
		hero.x += input.left_x;
		hero.y += input.left_y;
		hero.x += input.right_x;
		hero.y += input.right_y;
	} else if (state === 'pause') {

	} else if (state === 'continue?') {

	} else if (state === 'won') {

	}
}


function createHero() {
	hero = new Graphics();
	hero.beginFill(light_grey);

	hero.drawPolygon([-15, 50, 15, 50, 0, 0]);
	hero.endFill();

	hero.x = window.innerWidth/2;
	hero.y = window.innerHeight/2;
	
	hero.visible = false;
}


function getInput() {
	let gamepads = navigator.getGamepads();
	for (var i = 0; i < gamepads.length; i++) {
		if (gamepads[i] !== null) {
			gamepad.pad = gamepads[i];
			break;
		}
	}

	let input = {left_x: 0, left_y: 0, right_x: 0, right_y: 0};

	// left stick - x axis - right
	let pos = gamepad.pad.axes[gamepad.bindings.left_h];
	let rest = gamepad.bindings.resting[gamepad.bindings.left_h];
	let max_diff = gamepad.bindings.left_right;
	let pct = getPercentage(rest, max_diff, pos);
	if (pct !== false) {
		if (pct > 1.0) {
			gamepad.bindings.left_right = pos;
			pct = 1.0;
		}
		input.left_x = pct;
	}
	// left stick - x axis - left
	if (gamepad.bindings.left_h2 !== undefined) {
		pos = gamepad.pad.axes[gamepad.bindings.left_h2];
		rest = gamepad.bindings.resting[gamepad.bindings.left_h2];
	} else {
		pos = gamepad.pad.axes[gamepad.bindings.left_h];
		rest = gamepad.bindings.resting[gamepad.bindings.left_h];
	}
	max_diff = gamepad.bindings.left_left;
	pct = getPercentage(rest, max_diff, pos);
	if (pct !== false) {
		if (pct > 1.0) {
			gamepad.bindings.left_left = pos;
			pct = 1.0;
		}
		input.left_x -= pct;
	}
	// left stick - y axis - down
	pos = gamepad.pad.axes[gamepad.bindings.left_v];
	rest = gamepad.bindings.resting[gamepad.bindings.left_v];
	max_diff = gamepad.bindings.left_down;
	pct = getPercentage(rest, max_diff, pos);
	if (pct !== false) {
		if (pct > 1.0) {
			gamepad.bindings.left_down = pos;
			pct = 1.0;
		}
		input.left_y = pct;
	}
	// left stick - y axis - up
	if (gamepad.bindings.left_v2 !== undefined) {
		pos = gamepad.pad.axes[gamepad.bindings.left_v2];
		rest = gamepad.bindings.resting[gamepad.bindings.left_v2];
	} else {
		pos = gamepad.pad.axes[gamepad.bindings.left_v];
		rest = gamepad.bindings.resting[gamepad.bindings.left_v];
	}
	max_diff = gamepad.bindings.left_up;
	pct = getPercentage(rest, max_diff, pos);
	if (pct !== false) {
		if (pct > 1.0) {
			gamepad.bindings.left_up = pos;
			pct = 1.0;
		}
		input.left_y -= pct;
	}

	// right stick - x axis - right
	pos = gamepad.pad.axes[gamepad.bindings.right_h];
	rest = gamepad.bindings.resting[gamepad.bindings.right_h];
	max_diff = gamepad.bindings.right_right;
	pct = getPercentage(rest, max_diff, pos);
	if (pct !== false) {
		if (pct > 1.0) {
			gamepad.bindings.right_right = pos;
			pct = 1.0;
		}
		input.right_x = pct;
	}
	// right stick - x axis - left
	if (gamepad.bindings.right_h2 !== undefined) {
		pos = gamepad.pad.axes[gamepad.bindings.right_h2];
		rest = gamepad.bindings.resting[gamepad.bindings.right_h2];
	} else {
		pos = gamepad.pad.axes[gamepad.bindings.right_h];
		rest = gamepad.bindings.resting[gamepad.bindings.right_h];
	}
	max_diff = gamepad.bindings.right_left;
	pct = getPercentage(rest, max_diff, pos);
	if (pct !== false) {
		if (pct > 1.0) {
			gamepad.bindings.right_left = pos;
			pct = 1.0;
		}
		input.right_x -= pct;
	}
	// right stick - y axis - down
	pos = gamepad.pad.axes[gamepad.bindings.right_v];
	rest = gamepad.bindings.resting[gamepad.bindings.right_v];
	max_diff = gamepad.bindings.right_down;
	pct = getPercentage(rest, max_diff, pos);
	if (pct !== false) {
		if (pct > 1.0) {
			gamepad.bindings.right_down = pos;
			pct = 1.0;
		}
		input.right_y = pct;
	}
	// right stick - y axis - up
	if (gamepad.bindings.right_v2 !== undefined) {
		pos = gamepad.pad.axes[gamepad.bindings.right_v2];
		rest = gamepad.bindings.resting[gamepad.bindings.right_v2];
	} else {
		pos = gamepad.pad.axes[gamepad.bindings.right_v];
		rest = gamepad.bindings.resting[gamepad.bindings.right_v];
	}
	max_diff = gamepad.bindings.right_up;
	pct = getPercentage(rest, max_diff, pos);
	if (pct !== false) {
		if (pct > 1.0) {
			gamepad.bindings.right_up = pos;
			pct = 1.0;
		}
		input.right_y -= pct;
	}

	return input;
}


function getPercentage(rest, max, curr) {
	if (max > rest) {
		if (curr < rest)
			return false;
		return (curr - rest) / Math.abs(max - rest)
	}
	if (curr > rest)
		return false;
	return (rest - curr) / Math.abs(max - rest)
}


function bindControls() {
	let gamepads = navigator.getGamepads();
	for (var i = 0; i < gamepads.length; i++) {
		if (gamepads[i] !== null) {
			gamepad.pad = gamepads[i];
			break;
		}
	}
	if (gamepad.bindings.resting === undefined) {
		gamepad.bindings.resting = gamepad.pad.axes;
		t.text = 'Move the left stick up.';
	} else if (gamepad.bindings.left_v === undefined) {
		let max_diff = 0;
		let axis = 0;
		for (var i = 0; i < gamepad.pad.axes.length; i++) {
			let diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
			if (diff > max_diff) {
				max_diff = diff;
				axis = i;
			}
		}
		if (max_diff > 0.2) {
			gamepad.bindings.left_v = axis;
			gamepad.bindings.left_up = gamepad.pad.axes[axis];
			t.text = 'Move the left stick right.';
		}
	} else if (gamepad.bindings.left_h === undefined) {
		let max_diff = 0;
		let axis = 0;
		for (var i = 0; i < gamepad.pad.axes.length; i++) {
			let diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
			if (diff > max_diff) {
				max_diff = diff;
				axis = i;
			}
		}
		if (max_diff > 0.2 && axis !== gamepad.bindings.left_v) {
			gamepad.bindings.left_h = axis;
			gamepad.bindings.left_right = gamepad.pad.axes[axis];
			t.text = 'Move the left stick down.';
		}
	} else if (gamepad.bindings.left_down === undefined) {
		let max_diff = 0;
		let axis = 0;
		for (var i = 0; i < gamepad.pad.axes.length; i++) {
			let diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
			if (diff > max_diff) {
				max_diff = diff;
				axis = i;
			}
		}
		if (max_diff > 0.2 && axis !== gamepad.bindings.left_h) {
			if (axis !== gamepad.bindings.left_v) {
				gamepad.bindings.left_v2 = axis;
			}
			gamepad.bindings.left_down = gamepad.pad.axes[axis];
			t.text = 'Move the left stick left.';
		}
	} else if (gamepad.bindings.left_left === undefined) {
		let max_diff = 0;
		let axis = 0;
		for (var i = 0; i < gamepad.pad.axes.length; i++) {
			let diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
			if (diff > max_diff) {
				max_diff = diff;
				axis = i;
			}
		}
		if (max_diff > 0.2 && axis !== gamepad.bindings.left_v && axis !== gamepad.bindings.left_v2) {
			if (axis !== gamepad.bindings.left_h) {
				gamepad.bindings.left_h2 = axis;
			}
			gamepad.bindings.left_left = gamepad.pad.axes[axis];
			t.text = 'Move the right stick up.';
		}
	} else if (gamepad.bindings.right_v === undefined) {
		let max_diff = 0;
		let axis = 0;
		for (var i = 0; i < gamepad.pad.axes.length; i++) {
			let diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
			if (diff > max_diff) {
				max_diff = diff;
				axis = i;
			}
		}
		if (max_diff > 0.2 && axis !== gamepad.bindings.left_h && axis !== gamepad.bindings.left_h2 && axis !== gamepad.bindings.left_v && axis !== gamepad.bindings.left_v2) {
			gamepad.bindings.right_v = axis;
			gamepad.bindings.right_up = gamepad.pad.axes[axis];
			t.text = 'Move the right stick right.';
		}
	} else if (gamepad.bindings.right_h === undefined) {
		let max_diff = 0;
		let axis = 0;
		for (var i = 0; i < gamepad.pad.axes.length; i++) {
			let diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
			if (diff > max_diff) {
				max_diff = diff;
				axis = i;
			}
		}
		if (max_diff > 0.2 && axis !== gamepad.bindings.right_v) {
			gamepad.bindings.right_h = axis;
			gamepad.bindings.right_right = gamepad.pad.axes[axis];
			t.text = 'Move the right stick down.';
		}
	} else if (gamepad.bindings.right_down === undefined) {
		let max_diff = 0;
		let axis = 0;
		for (var i = 0; i < gamepad.pad.axes.length; i++) {
			let diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
			if (diff > max_diff) {
				max_diff = diff;
				axis = i;
			}
		}
		if (max_diff > 0.2 && axis !== gamepad.bindings.right_h) {
			if (axis !== gamepad.bindings.right_v) {
				gamepad.bindings.right_v2 = axis;
			}
			gamepad.bindings.right_down = gamepad.pad.axes[axis];
			t.text = 'Move the right stick left.';
		}
	} else if (gamepad.bindings.right_left === undefined) {
		let max_diff = 0;
		let axis = 0;
		for (var i = 0; i < gamepad.pad.axes.length; i++) {
			let diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
			if (diff > max_diff) {
				max_diff = diff;
				axis = i;
			}
		}
		if (max_diff > 0.2 && axis !== gamepad.bindings.right_v && axis !== gamepad.bindings.right_v2) {
			if (axis !== gamepad.bindings.right_h) {
				gamepad.bindings.right_h2 = axis;
			}
			gamepad.bindings.right_left = gamepad.pad.axes[axis];
			return true;
		}
	}
	return false;
}