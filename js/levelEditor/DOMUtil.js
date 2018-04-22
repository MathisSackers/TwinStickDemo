// Manipulating element sizes, classes and content, also removing the trash
/* global HierarchyUtil */

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
      // <div class="dropzone"></div>
      const div = document.createElement('div');
      div.classList.add('dropzone');
      elem.appendChild(div);
      HierarchyUtil.setChildren(div, []);
      HierarchyUtil.addToHierarchy(elem, div);
    }
  },

  // adds child elements to box
  splitBox(elem) {
    if (elem.parentNode.classList.contains('action')) {
      // <div class="dropzone"></div>
      const div = document.createElement('div');
      div.classList.add('dropzone');
      elem.after(div);
      const oldChildren = HierarchyUtil.getChildren(elem.parentNode);
      oldChildren.push(div);
      HierarchyUtil.setChildren(div, []);
      HierarchyUtil.setParent(div, elem.parentNode);
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
    elem.parentNode.removeChild(elem);
  },
};
