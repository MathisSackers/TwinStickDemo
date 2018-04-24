// Implementation of a statemachine to manage gamestate

class StateMachine {
  constructor() {
    this.state = new BindingState();
  }

  update(delta) {
    this.state.update(delta);
  }

  transition(newState) {
    switch (newState) {
      case 'PlayState':
        this.state = new PlayState(this.state.exit());
        break;
      case 'PauseState':
        this.state = new PauseState(this.state.exit());
        break;
      case 'DeathState':
        this.state = new DeathState(this.state.exit());
        break;
      case 'BindingState':
        this.state = new BindingState(this.state.exit());
        break;
      case 'WinState':
        this.state = new WinState(this.state.exit());
        break;
      default:
        console.error(`Unknown State ${newState}`);
    }
  }
}
