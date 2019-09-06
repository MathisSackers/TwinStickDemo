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

const GamepadUtil = {
  // Vars
  // buttons that are supported
  buttonsArray: ['A', 'B', 'Y', 'X', 'Start', 'Select', 'R1', 'L1', 'R2', 'L2'],
  // array of gamepads last state
  input: [
    { ...templateInput },
    { ...templateInput },
    { ...templateInput },
    { ...templateInput }],
  // array of gamepads and their bindings
  gamepad: [{ bindings: {}, bound_buttons: [], noise_axes: [] },
    { bindings: {}, bound_buttons: [], noise_axes: [] },
    { bindings: {}, bound_buttons: [], noise_axes: [] },
    { bindings: {}, bound_buttons: [], noise_axes: [] }],

  // Fuctions
  // calculates how far a stick is moved
  getPercentage(rest, max, curr) {
    if (max > rest) {
      if (curr < rest) { return false; }
      return (curr - rest) / Math.abs(max - rest);
    }
    if (curr > rest) { return false; }
    return (rest - curr) / Math.abs(max - rest);
  },

  // binds a button
  bindButton(buttonName, padIndex) {
    for (let i = 0; i < this.gamepad[padIndex].pad.buttons.length; i += 1) {
      if (this.gamepad[padIndex].pad.buttons[i].pressed
        && !this.gamepad[padIndex].bound_buttons.includes(this.gamepad[padIndex].pad.buttons[i])
      ) {
        this.gamepad[padIndex].bindings[`${buttonName}_button`] = i;
        this.gamepad[padIndex].bound_buttons.push(this.gamepad[padIndex].pad.buttons[i]);
        return true;
      }
    }
    return false;
  },

  // identifies axes which are moved
  identifyMovedAxis(padIndex) {
    let maxDiff = 0;
    let axis = 0;
    for (let i = 0; i < this.gamepad[padIndex].pad.axes.length; i += 1) {
      if (!this.gamepad[padIndex].noise_axes.includes(i)) {
        const diff = Math.abs(this.gamepad[padIndex].pad.axes[i]
          - this.gamepad[padIndex].bindings.resting[i]);
        if (diff > maxDiff) {
          maxDiff = diff;
          axis = i;
        }
      }
    }
    return { axis, difference: maxDiff };
  },

  // binds a stick
  bindStick(stickName, otherStick, padIndex) {
    const iAxis = this.identifyMovedAxis(padIndex);
    // relevant movement; not on the other stick
    if (iAxis.difference > 0.3
        && iAxis.axis !== this.gamepad[padIndex].bindings[`${otherStick}_v`]
        && iAxis.axis !== this.gamepad[padIndex].bindings[`${otherStick}_v2`]
        && iAxis.axis !== this.gamepad[padIndex].bindings[`${otherStick}_h`]
        && iAxis.axis !== this.gamepad[padIndex].bindings[`${otherStick}_h2`]
        && iAxis.axis !== this.gamepad[padIndex].bindings[`${stickName}_v2`]
        && iAxis.axis !== this.gamepad[padIndex].bindings[`${stickName}_h2`]
    ) {
      if (this.gamepad[padIndex].bindings[`${stickName}_v`] === undefined) {
        this.gamepad[padIndex].bindings[`${stickName}_v`] = iAxis.axis;
        this.gamepad[padIndex].bindings[`${stickName}_up`] = this.gamepad[padIndex].pad.axes[iAxis.axis];
        return `Move the ${stickName} stick right.`;
      } else if (this.gamepad[padIndex].bindings[`${stickName}_h`] === undefined) {
        if (iAxis.axis !== this.gamepad[padIndex].bindings[`${stickName}_v`]) {
          this.gamepad[padIndex].bindings[`${stickName}_h`] = iAxis.axis;
          this.gamepad[padIndex].bindings[`${stickName}_right`] = this.gamepad[padIndex].pad.axes[iAxis.axis];
          return `Move the ${stickName} stick down.`;
        }
      } else if (this.gamepad[padIndex].bindings[`${stickName}_down`] === undefined) {
        if (iAxis.axis !== this.gamepad[padIndex].bindings[`${stickName}_h`]) {
          if (iAxis.axis !== this.gamepad[padIndex].bindings[`${stickName}_v`]) {
            this.gamepad[padIndex].bindings[`${stickName}_v2`] = iAxis.axis;
          }
          this.gamepad[padIndex].bindings[`${stickName}_down`] = this.gamepad[padIndex].pad.axes[iAxis.axis];
          return `Move the ${stickName} stick left.`;
        }
      } else if (this.gamepad[padIndex].bindings[`${stickName}_left`] === undefined) {
        if (iAxis.axis !== this.gamepad[padIndex].bindings[`${stickName}_v`]) {
          if (iAxis.axis !== this.gamepad[padIndex].bindings[`${stickName}_h`]) {
            this.gamepad[padIndex].bindings[`${stickName}_h2`] = iAxis.axis;
          }
          this.gamepad[padIndex].bindings[`${stickName}_left`] = this.gamepad[padIndex].pad.axes[iAxis.axis];
          return true;
        }
      }
    }
    return false;
  },

  // binds the whole controller
  bindControls(padIndex) {
    // get new gamepad state
    const gamepads = navigator.getGamepads();
    this.gamepad[padIndex].pad = gamepads[padIndex];
    if (this.gamepad[padIndex].pad !== null) {
      if (this.gamepad[padIndex].waitRelease !== undefined) {
        // we should wait til the user releases this button
        if (!this.gamepad[padIndex].waitRelease.pressed) {
          this.gamepad[padIndex].waitRelease = undefined;
        }
        return 'Unbound the controller.';
      } else if (this.gamepad[padIndex].bindings.resting === undefined) {
        this.gamepad[padIndex].bindings.resting = this.gamepad[padIndex].pad.axes;
        return 'Press the A button.';
      } else if (this.gamepad[padIndex].bindings.L2_button === undefined) {
        if (this.gamepad[padIndex].bindings.Y_button === undefined) {
          // while binding the first three buttons identify noise axes (e.g. accelometer)
          const iAxis = this.identifyMovedAxis(padIndex);
          if (iAxis.difference > 0.3) {
            this.gamepad[padIndex].noise_axes.push(iAxis.axis);
          }
        }
        // bind the four face buttons, start, select and the shoulder buttons;
        let returnVal = false;
        let followingReturn = false;
        this.buttonsArray.forEach((buttonName) => {
          if (this.gamepad[padIndex].bindings[`${buttonName}_button`] === undefined) {
            if (followingReturn) {
              followingReturn = false;
              returnVal = `Press the ${buttonName} button.`;
            }
            if (returnVal === false && this.bindButton(buttonName, padIndex)) {
              followingReturn = true;
            }
          }
        });
        // all buttons done
        if (followingReturn) {
          returnVal = 'Move the left stick up.';
        }
        return returnVal;
      } else if (this.gamepad[padIndex].bindings.left_left === undefined) {
        const returnVal = this.bindStick('left', 'right', padIndex);
        if (returnVal === true) {
          return 'Move the right stick up.';
        }
        return returnVal;
      } else if (this.gamepad[padIndex].bindings.right_left === undefined) {
        return this.bindStick('right', 'left', padIndex);
      }
    }
    return this.gamepad[padIndex].bindings.right_left !== undefined;
  },

  // gets the percentage of one stick in one direction
  getStickPct(padIndex, stickName, maxName, axisName) {
    const pos = this.gamepad[padIndex].pad.axes[this.gamepad[padIndex].bindings[`${stickName}_${axisName}`]];
    const rest = this.gamepad[padIndex].bindings.resting[this.gamepad[padIndex].bindings[`${stickName}_${axisName}`]];
    const maxDiff = this.gamepad[padIndex].bindings[`${stickName}_${maxName}`];
    let pct = this.getPercentage(rest, maxDiff, pos);
    if (pct !== false) {
      if (pct > 1.0) {
        this.gamepad[padIndex].bindings[`${stickName}_${maxName}`] = pos;
        pct = 1.0;
      }
      return pct;
    }
    return 0.0;
  },

  // resets the binding for a specific pad
  resetBinding(padIndex) {
    this.gamepad[padIndex] = {
      bindings: {},
      bound_buttons: [],
      noise_axes: [],
      waitRelease: this.gamepad[padIndex].bindings.B_button,
    };
  },

  // returns the current state of the specefied stick and gamepad
  getStickInput(padIndex, stickName) {
    let x = this.getStickPct(padIndex, stickName, 'right', 'h');
    if (this.gamepad[padIndex].bindings[`${stickName}_h2`] !== undefined) {
      x -= this.getStickPct(padIndex, stickName, 'left', 'h2');
    } else {
      x -= this.getStickPct(padIndex, stickName, 'left', 'h');
    }
    let y = -this.getStickPct(padIndex, stickName, 'up', 'v');
    if (this.gamepad[padIndex].bindings[`${stickName}_v2`] !== undefined) {
      y += this.getStickPct(padIndex, stickName, 'down', 'v2');
    } else {
      y += this.getStickPct(padIndex, stickName, 'down', 'v');
    }
    return { x, y };
  },

  // returns the current input state of the gamepad at specefied index
  getInput(padIndex) {
    const gamepads = navigator.getGamepads();
    this.gamepad[padIndex].pad = gamepads[padIndex];
    // get sticks
    const leftStick = this.getStickInput(padIndex, 'left');
    const rightStick = this.getStickInput(padIndex, 'right');
    this.input[padIndex].left_x = leftStick.x;
    this.input[padIndex].left_y = leftStick.y;
    this.input[padIndex].right_x = rightStick.x;
    this.input[padIndex].right_y = rightStick.y;
    // get buttons
    this.buttonsArray.forEach((buttonName) => {
      // reset the one-frame-states
      this.input[padIndex][`${buttonName}_press`] = false;
      this.input[padIndex][`${buttonName}_release`] = false;
      // update one-frame-states
      const index = this.gamepad[padIndex].bindings[`${buttonName}_button`];
      if (this.gamepad[padIndex].pad.buttons[index].pressed !== this.input[padIndex][`${buttonName}_down`]) {
        this.input[padIndex][`${buttonName}_press`] = this.gamepad[padIndex].pad.buttons[index].pressed;
        this.input[padIndex][`${buttonName}_release`] = this.input[padIndex][`${buttonName}_down`];
      }
      // current state
      this.input[padIndex][`${buttonName}_down`] = this.gamepad[padIndex].pad.buttons[index].pressed;
    });
    return this.input[padIndex];
  },

  // returns the indecis of available gamepads
  getPads() {
    const pads = [];
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i += 1) {
      if (gamepads[i] !== null) {
        pads.push(i);
      }
    }
    return pads;
  },

  // converts the current binding into string format
  bindingToString() {
    const array = [];
    this.gamepad.forEach((boundPad) => {
      if (boundPad.pad !== undefined && boundPad.bindings.right_left !== undefined) {
        const myObj = { id: boundPad.pad.id };
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
        this.buttonsArray.forEach((buttonName) => {
          myObj[`${buttonName}_button`] = boundPad.pad.buttons.indexOf(boundPad.bindings[`${buttonName}_button`]);
        });
        array.push(myObj);
      }
    });
    const string = JSON.stringify({ bindings: array });
    return string;
  },

  // converts/applies a string into the binding
  bindingFromString(string) {
    const json = JSON.parse(string);
    const { bindings } = json;
    const gamepads = navigator.getGamepads();
    for (let p = 0; p < gamepads.length; p += 1) {
      for (let i = 0; i < bindings.length; i += 1) {
        if (gamepads[p] !== null && gamepads[p].id === bindings[i].id) {
          // sticks
          ['left', 'right'].forEach((beginning) => {
            ['up', 'down', 'left', 'right', 'v', 'h'].forEach((ending) => {
              this.gamepad[p].bindings[`${beginning}_${ending}`] = bindings[i][`${beginning}_${ending}`];
              if (bindings[i][`${beginning}_${ending}2`] !== undefined) {
                this.gamepad[p].bindings[`${beginning}_${ending}2`] = bindings[i][`${beginning}_${ending}2`];
              }
            });
          });
          // buttons
          this.buttonsArray.forEach((buttonName) => {
            this.gamepad[p].bindings[`${buttonName}_button`] = this.gamepad[p].pad.buttons[bindings[i][`${buttonName}_button`]];
          });
          // init resting; might differ per controller
          this.gamepad[p].bindings.resting = this.gamepad[p].pad.axes;
        }
      }
    }
  },
};
