// manages x, y and z position of elements
/* global HierarchyUtil */

//
const PositionUtil = {
  // calculates the absolute position of a HTML element
  absolutePosition(elem) {
    const rect = elem.getBoundingClientRect();
    const offLeft = window.pageXOffset;
    const offTop = window.pageYOffset;
    return { top: rect.top + offTop, left: rect.left + offLeft };
  },

  // set position of children to match parent
  moveChildren(elem) {
    if (elem !== undefined) {
      if (elem.classList.contains('dropzone')) {
        if (HierarchyUtil.getChildren(elem).length !== 0) {
          const child = HierarchyUtil.getChildren(elem)[0];
          const { left, top } = this.absolutePosition(elem);
          child.style.top = `${top}px`;
          child.style.left = `${left}px`;
          this.moveChildren(child, true);
        }
      } else {
        elem.classList.add('dragging');
        HierarchyUtil.getChildren(elem).forEach((child) => {
          this.moveChildren(child, true);
        });
      }
    }
  },

  // set position for drag-event (also for children)
  dragMoveListener(event) {
    const { target } = event;
    // current position
    let { left, top } = getComputedStyle(target, null);
    // remove 'px'
    left = Number(left.slice(0, left.length - 2));
    top = Number(top.slice(0, top.length - 2));
    // new position
    const x = left + event.dx;
    const y = top + event.dy;
    // set position
    target.style.top = `${y}px`;
    target.style.left = `${x}px`;
    // this.moveChildren(target); does not work
    PositionUtil.moveChildren(target);
  },


  // finds the highjst z-index
  findHighestZIndex() {
    const elems = document.body.children;
    let highest = 0;
    for (let i = 0; i < elems.length; i += 1) {
      const zindex = Number(document.defaultView.getComputedStyle(elems[i], null).getPropertyValue('z-index'));
      if ((zindex > highest) && (zindex !== 'auto')) {
        highest = zindex;
      }
    }
    return Number(highest);
  },

  // recursively sets the highest z-index for a box and its children
  setHighestZ(elem, z = this.findHighestZIndex() + 1) {
    const e = elem;
    e.style.zIndex = z;
    HierarchyUtil.getChildren(e).forEach((child) => {
      this.setHighestZ(child, z + 1);
    });
  },
};
