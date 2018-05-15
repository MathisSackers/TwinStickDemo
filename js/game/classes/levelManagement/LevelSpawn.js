// Implementation of the <spawn> tag

// Contents - ttl?, ctl?, (enemy | enemyRef)

// Example
// <spawn>
//  <enemy>
//   ...
//  </enemy>
// </spawn>

class LevelSpawn extends LevelObject {
  constructor(node) {
    super();
    this.node = node;
    this.readNodes();
    return this;
  }

  readNodes() {
    for (let i = 0; i < this.node.children.length; i += 1) {
      const node = this.node.children[i];
      switch (node.nodeName) {
        case 'enemy':
          this.enemy = spawnEnemy(node);
          break;
        case 'ttl':
          this.ttl = LevelExpression.eval(node.innerHTML);
          break;
        case 'ctl':
          this.ctl = this.node.children[i].innerHTML;
          break;
        case 'enemyRef':
          // TODO
          break;
        default:
          // Invalid input
          console.error('Unknown node: ', node);
      }
    }
  }

  update(delta) {
    this.isDead = !this.enemy.onScreen;
    if (!this.isDone) {
      this.isDone = this.isDead;
    }
    // we might not live forever
    if (this.ctl !== undefined && !LevelEvaluation.eval(this.ctl)) {
      this.kill();
    } else if (this.ttl !== undefined) {
      this.ttl -= delta;
      if (this.ttl <= 0) {
        this.kill();
      }
    }
    return this;
  }

  remove() {
    return this.isDone && this.isDead;
  }

  kill() {
    this.enemy.remove();
    this.enemy = null;
    this.isDone = true;
    this.isDead = true;
  }
}
