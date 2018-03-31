gamepad = new Gamepad();
/*
FIXME: use these events
gamepad.bind(Gamepad.Event.CONNECTED, (device) => {
  console.log('Connected', device);
});

gamepad.bind(Gamepad.Event.DISCONNECTED, (device) => {
  console.log('Disconnected', device);
});
*/
const newState = {};

gamepad.bind(Gamepad.Event.TICK, (gamepads) => {
  gamepads.forEach((gamepad) => {
    if (gamepad) {
      newState.left_x = gamepad.state.LEFT_STICK_X;
      newState.left_y = gamepad.state.LEFT_STICK_Y;
      newState.right_x = gamepad.state.RIGHT_STICK_X;
      newState.right_y = gamepad.state.RIGHT_STICK_Y;
      newState.ok_down = gamepad.state.FACE_3;
      newState.pause_down = gamepad.state.FACE_2;
      newState.fire_down = gamepad.state.RIGHT_TOP_SHOULDER;
      /*
      FIXME: use these assignments
      newState.left_top_shoulder = gamepad.state.LEFT_TOP_SHOULDER;
      newState.left_bottom_shoulder = gamepad.state.LEFT_BOTTOM_SHOULDER;
      newState.right_bottom_shoulder = gamepad.state.RIGHT_BOTTOM_SHOULDER;
      newState.select_back = gamepad.state.SELECT_BACK;
      newState.start_forward = gamepad.state.START_FORWARD;
      newState.left_stick = gamepad.state.LEFT_STICK;
      newState.right_stick = gamepad.state.RIGHT_STICK;
      newState.dpad_up = gamepad.state.DPAD_UP;
      newState.dpad_down = gamepad.state.DPAD_DOWN;
      newState.dpad_left = gamepad.state.DPAD_LEFT;
      newState.dpad_right = gamepad.state.DPAD_RIGHT;
      newState.home = gamepad.state.HOME;
      */
    }
  });
});

if (!gamepad.init()) {
  alert('Your browser does not support gamepads, get the latest Google Chrome or Firefox.');
}

function bindControls() {
  // FIXME: reimplement this functionality
  return true;
}

function getInput() {
  // reset the one-frame-states
  input.ok_press = false;
  input.ok_release = false;
  input.fire_press = false;
  input.fire_release = false;
  input.pause_press = false;
  input.pause_release = false;
  // update with the new
  if (newState.ok_down !== undefined) {
    if (newState.ok_down !== input.ok_down) {
      input.ok_press = newState.ok_down;
      input.ok_release = input.ok_down;
    }
    if (newState.fire_down !== input.fire_down) {
      input.fire_press = newState.fire_down;
      input.fire_release = input.fire_down;
    }
    if (newState.pause_down !== input.pause_down) {
      input.pause_press = newState.pause_down;
      input.pause_release = input.pause_down;
    }
    input.left_x = newState.left_x;
    input.left_y = newState.left_y;
    input.right_x = newState.right_x;
    input.right_y = newState.right_y;
    input.ok_down = newState.ok_down;
    input.pause_down = newState.pause_down;
    input.fire_down = newState.fire_down;
  }
  return input;
}
