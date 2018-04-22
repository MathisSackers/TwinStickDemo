// Template for tags

class LevelObject {
  // created from a document node
  constructor(node) {
    this.isDone = false;
    return this;
  }

  // called every frame
  update(delta) {
    return this;
  }

  // check whether we have to wait on this object
  done() {
    return this.isDone;
  }

  // check whether the object has completed its task and is childfree
  remove() {
    return this.isDone;
  }

  // when this is called we have to *kill all children*
  kill() {
    return this;
  }
}
