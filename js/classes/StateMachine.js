// Implementation of a statemachine to manage gamestate

class StateMachine {
  constructor() {
    this.state = new BindingState();
  }

  update(delta) {
    this.state.update(delta);
  }

  transition(newState) {
    if (newState === 'PlayState') {
      this.state = new PlayState(this.state.exit());
    } else if (newState === 'PauseState') {
      this.state = new PauseState(this.state.exit());
    } else if (newState === 'DeathState') {
      this.state = new DeathState(this.state.exit());
    } else if (newState === 'BindingState') {
      this.state = new BindingState(this.state.exit());
    } else if (newState === 'WinState') {
      this.state = new WinState(this.state.exit());
    }
  }
}
