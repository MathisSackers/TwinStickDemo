// managing the hierarchy

const HierarchyUtil = {
  // a map containing child/parent refereences for each node
  hierarchy: new Map(),

  // adds a new parent-child relationship to the hierarchy
  addToHierarchy(parent, child) {
    this.hierarchy.get(parent).children.push(child);
    this.hierarchy.get(child).parent = parent;
  },

  // removes the child from its parent
  removeParent(child) {
    const { parent } = this.hierarchy.get(child);
    if (parent !== undefined) {
      const index = this.hierarchy.get(parent).children.indexOf(child);
      this.hierarchy.get(parent).children.splice(index, 1);
      this.hierarchy.get(child).parent = undefined;
    }
    return parent;
  },

  // whether parent is an ancestor of child
  isAncestorOf(parent, child) {
    if (
      (this.hierarchy.get(parent) === undefined && document.getElementById('main') === parent)
      || (this.hierarchy.get(child) === undefined && document.getElementById('main') === child)
    ) {
      this.hierarchy.set(document.getElementById('main'), { children: [] });
    }
    if (this.hierarchy.get(child).parent !== undefined) {
      if (this.hierarchy.get(child).parent === parent) {
        return true;
      }
      return this.isAncestorOf(parent, this.hierarchy.get(child).parent);
    }
    return false;
  },

  getParent(elem) {
    return this.hierarchy.get(elem).parent;
  },

  getChildren(elem) {
    if (this.hierarchy.get(elem) === undefined) {
      this.hierarchy.set(elem, { children: [] });
    }
    return this.hierarchy.get(elem).children;
  },

  setChildren(elem, children) {
    if (this.getChildren(elem) === undefined) {
      this.hierarchy.set(elem, { children });
    }
    this.hierarchy.get(elem).children = children;
  },

  setParent(elem, parent) {
    this.hierarchy.get(elem).parent = parent;
  },

  remove(elem) {
    this.hierarchy.set(elem, undefined);
  },
};
