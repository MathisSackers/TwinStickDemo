// Manipulating element sizes, classes and content, also removing the trash
/* global HierarchyUtil, ExpandUtil */

const DOMUtil = {
  // resize dependent on child size
  childResize(elem) {
    if (elem !== undefined) {
      const e = elem;
      if (elem.classList.contains('dropzone')) {
        const children = HierarchyUtil.getChildren(elem);
        if (children.length !== 0) {
          // resize dependent on child
          let {
            borderWidth, width, height, padding,
          } = getComputedStyle(HierarchyUtil.getChildren(elem)[0], null);
          // to numbers
          height = Number(height.slice(0, height.length - 2));
          width = Number(width.slice(0, width.length - 2));
          padding = Number(padding.slice(0, padding.length - 2));
          borderWidth = Number(borderWidth.slice(0, borderWidth.length - 2));
          const totalHeight = height + (2 * padding) + (2 * borderWidth);
          const totalWidth = width + (2 * padding) + (2 * borderWidth);
          e.style.height = `${totalHeight}px`;
          e.style.width = `${totalWidth}px`;
          this.childResize(HierarchyUtil.getParent(elem));
        } else {
          e.style = undefined;
        }
      } else {
        this.childResize(HierarchyUtil.getParent(elem));
      }
    }
  },

  // adds child elements to box
  expandBox(elem) {
    if (elem.classList.contains('action')) {
      ExpandUtil.expandAction(elem);
    } else if (elem.classList.contains('repeat')) {
      ExpandUtil.expandRepeat(elem);
    } else if (elem.classList.contains('wait')) {
      ExpandUtil.expandWait(elem);
    } else if (elem.classList.contains('spawn')) {
      ExpandUtil.expandSpawn(elem);
    }
  },

  // adds empty dropzones before and after elem
  splitBox(elem) {
    if (elem.parentNode.classList.contains('action')) {
      // <div class="dropzone"></div>
      // one before the selcted one
      const divBefore = document.createElement('div');
      divBefore.classList.add('dropzone');
      elem.before(divBefore);
      // one after the selcted one
      const divAfter = document.createElement('div');
      divAfter.classList.add('dropzone');
      elem.after(divAfter);
      // splice into the children array
      const children = HierarchyUtil.getChildren(elem.parentNode);
      const middleIndex = children.indexOf(elem);
      children.splice(middleIndex + 1, 0, divAfter);
      children.splice(middleIndex, 0, divBefore);
      // and put them into the hierarchy
      HierarchyUtil.setChildren(divBefore, []);
      HierarchyUtil.setParent(divBefore, elem.parentNode);
      HierarchyUtil.setChildren(divAfter, []);
      HierarchyUtil.setParent(divAfter, elem.parentNode);
    }
  },

  // fuses empty dropzones before and after elem
  fuseBox(elem) {
    if (elem !== undefined && elem.parentNode.classList.contains('action')) {
      // <div class="dropzone"></div>
      // splice out of the children array
      const children = HierarchyUtil.getChildren(elem.parentNode);
      const middleIndex = children.indexOf(elem);
      const [divAfter] = children.splice(middleIndex - 1, 1);
      const [divBefore] = children.splice(middleIndex, 1);
      children.splice(middleIndex, 1);
      // and remove them from the hierarchy
      HierarchyUtil.remove(divBefore);
      HierarchyUtil.remove(divAfter);
      this.trash(divAfter);
      this.trash(divBefore);
    }
  },

  // trashes all children
  trash(elem) {
    if (elem !== undefined) {
      HierarchyUtil.getChildren(elem).forEach((child) => {
        this.trash(child);
      });
    }
    HierarchyUtil.remove(elem);
    if (elem.parentNode !== undefined) {
      elem.parentNode.removeChild(elem);
    }
  },
};
