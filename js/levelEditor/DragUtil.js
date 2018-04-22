// code for the levelEditor
/* global HierarchyUtil, DOMUtil, PositionUtil */

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
    const nodesToUpdate = [];
    for (let i = 0; i < zones.length; i += 1) {
      const elem = zones[i];
      if (this.canDrop(elem, draggable)) {
        elem.classList.add('drop-active');
        // resize the parents
        if (!elem.classList.contains('main')) {
          DOMUtil.childResize(elem.parentNode);
          nodesToUpdate.push(elem.parentNode);
        }
      }
    }
    nodesToUpdate.forEach((node) => {
      PositionUtil.moveChildren(node);
      this.dropChildren(node);
    });
  },

  // deactivates all dropzones
  deactivateDropzones(done = 15) {
    const zones = document.getElementsByClassName('drop-active');
    const nodesToUpdate = [];
    for (let i = 0; i < zones.length; i += 1) {
      const elem = zones[i];
      elem.classList.remove('drop-active');
      if (!elem.classList.contains('main')) {
        DOMUtil.childResize(elem.parentNode);
        nodesToUpdate.push(elem.parentNode);
      }
    }
    if (done > 0) {
      // do this 15 times to catch all
      this.deactivateDropzones(done - 1);
    }
    nodesToUpdate.forEach((node) => {
      PositionUtil.moveChildren(node);
      this.dropChildren(node);
    });
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
