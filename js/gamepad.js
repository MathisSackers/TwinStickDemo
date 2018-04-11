/* eslint no-loop-func:1 */
// no-input object
const templateInput = {
  left_x: 0,
  left_y: 0,
  right_x: 0,
  right_y: 0,
  A_press: false,
  A_down: false,
  A_release: false,
  B_press: false,
  B_down: false,
  B_release: false,
  X_press: false,
  X_down: false,
  X_release: false,
  Y_press: false,
  Y_down: false,
  Y_release: false,
  R1_press: false,
  R1_down: false,
  R1_release: false,
  L1_press: false,
  L1_down: false,
  L1_release: false,
  R2_press: false,
  R2_down: false,
  R2_release: false,
  L2_press: false,
  L2_down: false,
  L2_release: false,
  R3_press: false,
  R3_down: false,
  R3_release: false,
  L3_press: false,
  L3_down: false,
  L3_release: false,
  Start_press: false,
  Start_down: false,
  Start_release: false,
  Select_press: false,
  Select_down: false,
  Select_release: false,
};
// buttons that are supported
const buttonsArray = ['A', 'B', 'Y', 'X', 'Start', 'Select', 'R1', 'L1', 'R2', 'L2'];
// array of gamepads last state
const input = [templateInput, templateInput, templateInput, templateInput];
// array of gamepads and their bindings
const gamepad = [{ bindings: {}, bound_buttons: [], noise_axes: [] },
  { bindings: {}, bound_buttons: [], noise_axes: [] },
  { bindings: {}, bound_buttons: [], noise_axes: [] },
  { bindings: {}, bound_buttons: [], noise_axes: [] }];

// calculates how far a stick is moved
function getPercentage(rest, max, curr) {
  if (max > rest) {
    if (curr < rest) { return false; }
    return (curr - rest) / Math.abs(max - rest);
  }
  if (curr > rest) { return false; }
  return (rest - curr) / Math.abs(max - rest);
}

// binds a button
function bindButton(buttonName, padIndex) {
  for (let i = 0; i < gamepad[padIndex].pad.buttons.length; i += 1) {
    if (gamepad[padIndex].pad.buttons[i].pressed &&
      !gamepad[padIndex].bound_buttons.includes(gamepad[padIndex].pad.buttons[i])
    ) {
      gamepad[padIndex].bindings[`${buttonName}_button`] = gamepad[padIndex].pad.buttons[i];
      gamepad[padIndex].bound_buttons.push(gamepad[padIndex].pad.buttons[i]);
      return true;
    }
  }
  return false;
}

// identifies axes which are moved
function identifyMovedAxis(padIndex) {
  let maxDiff = 0;
  let axis = 0;
  for (let i = 0; i < gamepad[padIndex].pad.axes.length; i += 1) {
    if (!gamepad[padIndex].noise_axes.includes(i)) {
      const diff = Math.abs(gamepad[padIndex].pad.axes[i] - gamepad[padIndex].bindings.resting[i]);
      if (diff > maxDiff) {
        maxDiff = diff;
        axis = i;
      }
    }
  }
  return { axis, difference: maxDiff };
}

// binds a stick
function bindStick(stickName, otherStick, padIndex) {
  if (gamepad[padIndex].bindings[`${stickName}_v`] === undefined) {
    const iAxis = identifyMovedAxis(padIndex);
    if (iAxis.difference > 0.3 &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_v`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_v2`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_h`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_h2`]
    ) {
      gamepad[padIndex].bindings[`${stickName}_v`] = iAxis.axis;
      gamepad[padIndex].bindings[`${stickName}_up`] = gamepad[padIndex].pad.axes[iAxis.axis];
      return `Move the ${stickName} stick right.`;
    }
  } else if (gamepad[padIndex].bindings[`${stickName}_h`] === undefined) {
    const iAxis = identifyMovedAxis(padIndex);
    if (iAxis.difference > 0.3 &&
      iAxis.axis !== gamepad[padIndex].bindings[`${stickName}_v`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_v`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_v2`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_h`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_h2`]
    ) {
      gamepad[padIndex].bindings[`${stickName}_h`] = iAxis.axis;
      gamepad[padIndex].bindings[`${stickName}_right`] = gamepad[padIndex].pad.axes[iAxis.axis];
      return `Move the ${stickName} stick down.`;
    }
  } else if (gamepad[padIndex].bindings[`${stickName}_down`] === undefined) {
    const iAxis = identifyMovedAxis(padIndex);
    if (iAxis.difference > 0.3 &&
      iAxis.axis !== gamepad[padIndex].bindings[`${stickName}_h`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_v`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_v2`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_h`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_h2`]
    ) {
      if (iAxis.axis !== gamepad[padIndex].bindings[`${stickName}_v`]) {
        gamepad[padIndex].bindings[`${stickName}_v2`] = iAxis.axis;
      }
      gamepad[padIndex].bindings[`${stickName}_down`] = gamepad[padIndex].pad.axes[iAxis.axis];
      return `Move the ${stickName} stick left.`;
    }
  } else if (gamepad[padIndex].bindings[`${stickName}_left`] === undefined) {
    const iAxis = identifyMovedAxis(padIndex);
    if (iAxis.difference > 0.3 &&
      iAxis.axis !== gamepad[padIndex].bindings[`${stickName}_v`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${stickName}_v2`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_v`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_v2`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_h`] &&
      iAxis.axis !== gamepad[padIndex].bindings[`${otherStick}_h2`]
    ) {
      if (iAxis.axis !== gamepad[padIndex].bindings[`${stickName}_h`]) {
        gamepad[padIndex].bindings[`${stickName}_h2`] = iAxis.axis;
      }
      gamepad[padIndex].bindings[`${stickName}_left`] = gamepad[padIndex].pad.axes[iAxis.axis];
      return true;
    }
  }
  return false;
}

// binds the whole controller
function bindControls(padIndex) {
  // get new gamepad state
  const gamepads = navigator.getGamepads();
  gamepad[padIndex].pad = gamepads[padIndex];
  if (gamepad[padIndex].pad !== null) {
    if (gamepad[padIndex].bindings.resting === undefined) {
      gamepad[padIndex].bindings.resting = gamepad[padIndex].pad.axes;
      return 'Press the A button.';
    } else if (gamepad[padIndex].bindings.L2_button === undefined) {
      if (gamepad[padIndex].bindings.Y_button === undefined) {
        // while binding the first three buttons identify noise axes (e.g. accelometer)
        const iAxis = identifyMovedAxis(padIndex);
        if (iAxis.difference > 0.3) {
          gamepad[padIndex].noise_axes.push(iAxis.axis);
        }
      }
      // bind the four face buttons, start, select and the shoulder buttons;
      let returnVal = false;
      let followingReturn = false;
      buttonsArray.forEach((buttonName) => {
        if (gamepad[padIndex].bindings[`${buttonName}_button`] === undefined) {
          if (followingReturn) {
            followingReturn = false;
            returnVal = `Press the ${buttonName} button.`;
          }
          if (returnVal === false && bindButton(buttonName, padIndex)) {
            followingReturn = true;
          }
        }
      });
      // all buttons done
      if (followingReturn) {
        returnVal = 'Move the left stick up.';
      }
      return returnVal;
    } else if (gamepad[padIndex].bindings.left_left === undefined) {
      const returnVal = bindStick('left', 'right', padIndex);
      if (returnVal === true) {
        return 'Move the right stick up.';
      }
      return returnVal;
    } else if (gamepad[padIndex].bindings.right_left === undefined) {
      return bindStick('right', 'left', padIndex);
    }
  }
  return false;
}

// gets the percentage of one stick in one direction
function getStickPct(padIndex, stickName, maxName, axisName) {
  const pos = gamepad[padIndex].pad.axes[gamepad[padIndex].bindings[`${stickName}_${axisName}`]];
  const rest = gamepad[padIndex].bindings.resting[gamepad[padIndex].bindings[`${stickName}_${axisName}`]];
  const maxDiff = gamepad[padIndex].bindings[`${stickName}_${maxName}`];
  let pct = getPercentage(rest, maxDiff, pos);
  if (pct !== false) {
    if (pct > 1.0) {
      gamepad[padIndex].bindings[`${stickName}_${maxName}`] = pos;
      pct = 1.0;
    }
    return pct;
  }
  return 0.0;
}

// returns the current state of the specefied stick and gamepad
function getStickInput(padIndex, stickName) {
  let x = getStickPct(padIndex, stickName, 'right', 'h');
  if (gamepad[padIndex].bindings[`${stickName}_h2`] !== undefined) {
    x -= getStickPct(padIndex, stickName, 'left', 'h2');
  } else {
    x -= getStickPct(padIndex, stickName, 'left', 'h');
  }
  let y = -getStickPct(padIndex, stickName, 'up', 'v');
  if (gamepad[padIndex].bindings[`${stickName}_v2`] !== undefined) {
    y += getStickPct(padIndex, stickName, 'down', 'v2');
  } else {
    y += getStickPct(padIndex, stickName, 'down', 'v');
  }
  return { x, y };
}

// returns the current input state of the gamepad at specefied index
function getInput(padIndex) {
  const gamepads = navigator.getGamepads();
  gamepad[padIndex].pad = gamepads[padIndex];
  // get sticks
  const leftStick = getStickInput(padIndex, 'left');
  const rightStick = getStickInput(padIndex, 'right');
  input[padIndex].left_x = leftStick.x;
  input[padIndex].left_y = leftStick.y;
  input[padIndex].right_x = rightStick.x;
  input[padIndex].right_y = rightStick.y;
  // get buttons
  buttonsArray.forEach((buttonName) => {
    // reset the one-frame-states
    input[padIndex][`${buttonName}_press`] = false;
    input[padIndex][`${buttonName}_release`] = false;
    // update one-frame-states
    if (gamepad[padIndex].bindings[`${buttonName}_button`].pressed !== input[padIndex][`${buttonName}_down`]) {
      input[padIndex][`${buttonName}_press`] = gamepad[padIndex].bindings[`${buttonName}_button`].pressed;
      input[padIndex][`${buttonName}_release`] = input[padIndex][`${buttonName}_down`];
    }
    // current state
    input[padIndex][`${buttonName}_down`] = gamepad[padIndex].bindings[`${buttonName}_button`].pressed;
  });
  return input[padIndex];
}

// returns the indecis of available gamepads
function getPads() {
  const pads = [];
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i += 1) {
    if (gamepads[i] !== null) {
      pads.push(i);
    }
  }
  return pads;
}

// converts the current binding into string format
function bindingToString() {
  const array = [];
  gamepad.forEach((boundPad) => {
    const myObj = { bound: false };
    if (boundPad.pad !== undefined) {
      myObj.bound = true;
      // sticks
      ['left', 'right'].forEach((beginning) => {
        ['up', 'down', 'left', 'right', 'v', 'h'].forEach((ending) => {
          myObj[`${beginning}_${ending}`] = boundPad.bindings[`${beginning}_${ending}`];
          if (boundPad.bindings[`${beginning}_${ending}2`] !== undefined) {
            myObj[`${beginning}_${ending}2`] = boundPad.bindings[`${beginning}_${ending}2`];
          }
        });
      });
      // buttons
      buttonsArray.forEach((buttonName) => {
        myObj[`${buttonName}_button`] = boundPad.pad.buttons.indexOf(boundPad.bindings[`${buttonName}_button`]);
      });
      // resting
      myObj.resting = boundPad.bindings.resting;
    }
    array.push(myObj);
  });
  const string = JSON.stringify(array);
  return string;
}

// converts/applies a string into the binding
function bindingFromString(string) {
  const bindings = JSON.parse(string);
  for (let i = 0; i < bindings.length; i += 1) {
    if (bindings[i].bound) {
      // sticks
      ['left', 'right'].forEach((beginning) => {
        ['up', 'down', 'left', 'right', 'v', 'h'].forEach((ending) => {
          gamepad[i].bindings[`${beginning}_${ending}`] = bindings[i][`${beginning}_${ending}`];
          if (bindings[i][`${beginning}_${ending}2`] !== undefined) {
            gamepad[i].bindings[`${beginning}_${ending}2`] = bindings[i][`${beginning}_${ending}2`];
          }
        });
      });
      // buttons
      buttonsArray.forEach((buttonName) => {
        gamepad[i].bindings[`${buttonName}_button`] = gamepad[i].pad.buttons[bindings[i][`${buttonName}_button`]];
      });
      // resting
      gamepad[i].bindings.resting = bindings[i].resting;
    }
  }
}
