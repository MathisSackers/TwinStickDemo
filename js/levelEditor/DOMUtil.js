// Manipulating element sizes, classes and content, also removing the trash
/* global HierarchyUtil */

const DOMUtil = {
  // a child was added to this element, resize it!
  childAdded(elem) {
    if (elem !== undefined) {
      const e = elem;
      if (elem.classList.contains('dropzone')) {
        let { width, height, padding } = getComputedStyle(HierarchyUtil.getChildren(elem)[0], null);
        // to numbers
        height = Number(height.slice(0, height.length - 2));
        width = Number(width.slice(0, width.length - 2));
        padding = Number(padding.slice(0, padding.length - 2));
        const totalHeight = height + (2 * padding);
        const totalWidth = width + (2 * padding);
        e.style.height = `${totalHeight}px`;
        e.style.width = `${totalWidth}px`;
        this.childAdded(HierarchyUtil.getParent(elem));
      } else {
        this.childAdded(HierarchyUtil.getParent(elem));
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

  // a child was removed from this element, resize it!
  childRemoved(elem) {
    if (elem !== undefined) {
      const e = elem;
      if (elem.classList.contains('main')) {
        e.style.height = '50px';
        e.style.width = '150px';
      } else if (elem.classList.contains('dropzone')) {
        if (HierarchyUtil.getChildren(elem).length !== 0) {
          let { width, height, padding } = getComputedStyle(HierarchyUtil
            .getChildren(elem)[0], null);
          // to numbers
          height = Number(height.slice(0, height.length - 2));
          width = Number(width.slice(0, width.length - 2));
          padding = Number(padding.slice(0, padding.length - 2));
          const totalHeight = height + (2 * padding);
          const totalWidth = width + (2 * padding);
          e.style.height = `${totalHeight}px`;
          e.style.width = `${totalWidth}px`;
        } else {
          e.style = {};
        }
        this.childAdded(HierarchyUtil.getParent(elem));
      }
    }
  },

};
