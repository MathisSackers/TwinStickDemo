// code for the levelEditor
/* global HierarchyUtil */

const DragUtil = {
  // whether the dropbox is available
  canDrop(elem, draggable) {
    if (!HierarchyUtil.isAncestorOf(draggable, elem)
      && HierarchyUtil.getChildren(elem).length === 0
    ) {
      return true;
    }
    return false;
  },

  // activates relevant dropzones
  activateDropzones(draggable) {
    this.deactivateDropzones();
    const zones = document.getElementsByClassName('dropzone');
    for (let i = 0; i < zones.length; i += 1) {
      const elem = zones[i];
      if (this.canDrop(elem, draggable)) {
        elem.classList.add('drop-active');
      }
    }
  },

  // deactivates all dropzones
  deactivateDropzones() {
    const zones = document.getElementsByClassName('drop-active');
    for (let i = 0; i < zones.length; i += 1) {
      const elem = zones[i];
      elem.classList.remove('drop-active');
    }
  },

  // drop all children
  dropChildren(elem) {
    if (elem !== undefined) {
      if (elem.classList.contains('dragging')) {
        elem.classList.remove('dragging');
      }
      HierarchyUtil.getChildren(elem).forEach((child) => {
        this.dropChildren(child);
      });
    }
  },
};
