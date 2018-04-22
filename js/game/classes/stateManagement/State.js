// The state base-class

class State {
  constructor() {
    return this;
  }

  update() {
    return this;
  }

  exit() {
    return this.name;
  }
}
