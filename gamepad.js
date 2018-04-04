function getPercentage(rest, max, curr) {
  if (max > rest) {
    if (curr < rest) { return false; }
    return (curr - rest) / Math.abs(max - rest);
  }
  if (curr > rest) { return false; }
  return (rest - curr) / Math.abs(max - rest);
}

function bindControls() {
  // get one gamepad
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i += 1) {
    if (gamepads[i] !== null) {
      gamepad.pad = gamepads[i];
      break;
    }
  }
  if (gamepad.pad !== undefined) {
    if (gamepad.bindings.resting === undefined) {
      gamepad.bindings.resting = gamepad.pad.axes;
      return 'Move the left stick up.';
    } else if (gamepad.bindings.left_v === undefined) {
      let maxDiff = 0;
      let axis = 0;
      for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
        const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
        if (diff > maxDiff) {
          maxDiff = diff;
          axis = i;
        }
      }
      if (maxDiff > 0.2) {
        gamepad.bindings.left_v = axis;
        gamepad.bindings.left_up = gamepad.pad.axes[axis];
        return 'Move the left stick right.';
      }
    } else if (gamepad.bindings.left_h === undefined) {
      let maxDiff = 0;
      let axis = 0;
      for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
        const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
        if (diff > maxDiff) {
          maxDiff = diff;
          axis = i;
        }
      }
      if (maxDiff > 0.2 && axis !== gamepad.bindings.left_v) {
        gamepad.bindings.left_h = axis;
        gamepad.bindings.left_right = gamepad.pad.axes[axis];
        return 'Move the left stick down.';
      }
    } else if (gamepad.bindings.left_down === undefined) {
      let maxDiff = 0;
      let axis = 0;
      for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
        const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
        if (diff > maxDiff) {
          maxDiff = diff;
          axis = i;
        }
      }
      if (maxDiff > 0.2 && axis !== gamepad.bindings.left_h) {
        if (axis !== gamepad.bindings.left_v) {
          gamepad.bindings.left_v2 = axis;
        }
        gamepad.bindings.left_down = gamepad.pad.axes[axis];
        return 'Move the left stick left.';
      }
    } else if (gamepad.bindings.left_left === undefined) {
      let maxDiff = 0;
      let axis = 0;
      for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
        const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
        if (diff > maxDiff) {
          maxDiff = diff;
          axis = i;
        }
      }
      if (maxDiff > 0.2 && axis !== gamepad.bindings.left_v && axis !== gamepad.bindings.left_v2) {
        if (axis !== gamepad.bindings.left_h) {
          gamepad.bindings.left_h2 = axis;
        }
        gamepad.bindings.left_left = gamepad.pad.axes[axis];
        return 'Move the right stick up.';
      }
    } else if (gamepad.bindings.right_v === undefined) {
      let maxDiff = 0;
      let axis = 0;
      for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
        const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
        if (diff > maxDiff) {
          maxDiff = diff;
          axis = i;
        }
      }
      if (
        maxDiff > 0.2 && axis !== gamepad.bindings.left_h &&
        axis !== gamepad.bindings.left_h2 &&
        axis !== gamepad.bindings.left_v &&
        axis !== gamepad.bindings.left_v2
      ) {
        gamepad.bindings.right_v = axis;
        gamepad.bindings.right_up = gamepad.pad.axes[axis];
        return 'Move the right stick right.';
      }
    } else if (gamepad.bindings.right_h === undefined) {
      let maxDiff = 0;
      let axis = 0;
      for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
        const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
        if (diff > maxDiff) {
          maxDiff = diff;
          axis = i;
        }
      }
      if (maxDiff > 0.2 && axis !== gamepad.bindings.right_v) {
        gamepad.bindings.right_h = axis;
        gamepad.bindings.right_right = gamepad.pad.axes[axis];
        return 'Move the right stick down.';
      }
    } else if (gamepad.bindings.right_down === undefined) {
      let maxDiff = 0;
      let axis = 0;
      for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
        const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
        if (diff > maxDiff) {
          maxDiff = diff;
          axis = i;
        }
      }
      if (maxDiff > 0.2 && axis !== gamepad.bindings.right_h) {
        if (axis !== gamepad.bindings.right_v) {
          gamepad.bindings.right_v2 = axis;
        }
        gamepad.bindings.right_down = gamepad.pad.axes[axis];
        return 'Move the right stick left.';
      }
    } else if (gamepad.bindings.right_left === undefined) {
      let maxDiff = 0;
      let axis = 0;
      for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
        const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
        if (diff > maxDiff) {
          maxDiff = diff;
          axis = i;
        }
      }
      if (
        maxDiff > 0.2 && axis !== gamepad.bindings.right_v &&
        axis !== gamepad.bindings.right_v2
      ) {
        if (axis !== gamepad.bindings.right_h) {
          gamepad.bindings.right_h2 = axis;
        }
        gamepad.bindings.right_left = gamepad.pad.axes[axis];
        return 'Press the ok button.';
      }
    } else if (gamepad.bindings.ok_button === undefined) {
      for (let i = 0; i < gamepad.pad.buttons.length; i += 1) {
        if (gamepad.pad.buttons[i].pressed) {
          gamepad.bindings.ok_button = gamepad.pad.buttons[i];
          return 'Press the pause button.';
        }
      }
    } else if (gamepad.bindings.pause_button === undefined) {
      for (let i = 0; i < gamepad.pad.buttons.length; i += 1) {
        if (
          gamepad.pad.buttons[i].pressed &&
          gamepad.pad.buttons[i] !== gamepad.bindings.ok_button
        ) {
          gamepad.bindings.pause_button = gamepad.pad.buttons[i];
          return 'Press the fire button.';
        }
      }
    } else if (gamepad.bindings.fire_button === undefined) {
      for (let i = 0; i < gamepad.pad.buttons.length; i += 1) {
        if (
          gamepad.pad.buttons[i].pressed &&
          gamepad.pad.buttons[i] !== gamepad.bindings.pause_button &&
          gamepad.pad.buttons[i] !== gamepad.bindings.ok_button
        ) {
          gamepad.bindings.fire_button = gamepad.pad.buttons[i];
          return true;
        }
      }
    }
  }
  return false;
}

function getInput() {
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i += 1) {
    if (gamepads[i] !== null) {
      gamepad.pad = gamepads[i];
      break;
    }
  }

  input.left_x = 0;
  input.left_y = 0;
  input.right_x = 0;
  input.right_y = 0;

  // left stick - x axis - right
  let pos = gamepad.pad.axes[gamepad.bindings.left_h];
  let rest = gamepad.bindings.resting[gamepad.bindings.left_h];
  let maxDiff = gamepad.bindings.left_right;
  let pct = getPercentage(rest, maxDiff, pos);
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
  maxDiff = gamepad.bindings.left_left;
  pct = getPercentage(rest, maxDiff, pos);
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
  maxDiff = gamepad.bindings.left_down;
  pct = getPercentage(rest, maxDiff, pos);
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
  maxDiff = gamepad.bindings.left_up;
  pct = getPercentage(rest, maxDiff, pos);
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
  maxDiff = gamepad.bindings.right_right;
  pct = getPercentage(rest, maxDiff, pos);
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
  maxDiff = gamepad.bindings.right_left;
  pct = getPercentage(rest, maxDiff, pos);
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
  maxDiff = gamepad.bindings.right_down;
  pct = getPercentage(rest, maxDiff, pos);
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
  maxDiff = gamepad.bindings.right_up;
  pct = getPercentage(rest, maxDiff, pos);
  if (pct !== false) {
    if (pct > 1.0) {
      gamepad.bindings.right_up = pos;
      pct = 1.0;
    }
    input.right_y -= pct;
  }


  // ok button
  // reset the one-frame-states
  input.ok_press = false;
  input.ok_release = false;
  input.fire_press = false;
  input.fire_release = false;
  input.pause_press = false;
  input.pause_release = false;
  // update with the new
  if (gamepad.bindings.ok_button.pressed !== input.ok_down) {
    input.ok_press = gamepad.bindings.ok_button.pressed;
    input.ok_release = input.ok_down;
  }
  if (gamepad.bindings.fire_button.pressed !== input.fire_down) {
    input.fire_press = gamepad.bindings.fire_button.pressed;
    input.fire_release = input.fire_down;
  }
  if (gamepad.bindings.pause_button.pressed !== input.pause_down) {
    input.pause_press = gamepad.bindings.pause_button.pressed;
    input.pause_release = input.pause_down;
  }
  input.ok_down = gamepad.bindings.ok_button.pressed;
  input.fire_down = gamepad.bindings.fire_button.pressed;
  input.pause_down = gamepad.bindings.pause_button.pressed;
  return input;
}
