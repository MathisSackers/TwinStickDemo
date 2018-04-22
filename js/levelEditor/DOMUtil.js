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

  // creates an HTML <select>
  generateSelection(values, texts, onChange) {
    const select = document.createElement('select');
    select.onchange = onChange;
    let counter = 0;
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.innerHTML = texts[counter];
      counter += 1;
      select.appendChild(option);
    });
    return select;
  },

  // creates an HTML <button>
  generateButton(text, onClick) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.onclick = onClick;
    button.innerHTML = text;
    return button;
  },

  // creates an HTML <input>
  generateExpression(text = '_$rand + 4', csss = []) {
    const expression = document.createElement('input');
    expression.setAttribute('type', 'text');
    expression.setAttribute('title', 'expression');
    expression.setAttribute('placeholder', text);
    expression.classList.add('expression');
    csss.forEach((css) => {
      expression.classList.add(css);
    });
    return expression;
  },

  generateEvaluation(text = '4 == 4', csss = []) {
    const evaluation = document.createElement('input');
    evaluation.setAttribute('type', 'text');
    evaluation.setAttribute('title', 'evaluation');
    evaluation.setAttribute('placeholder', text);
    evaluation.classList.add('evaluation');
    csss.forEach((css) => {
      evaluation.classList.add(css);
    });
    return evaluation;
  },

  generateInput(text = 'Type here.', placeholder = 'Type here.', csss = []) {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('title', text);
    input.setAttribute('placeholder', placeholder);
    csss.forEach((css) => {
      input.classList.add(css);
    });
    return input;
  },

  generateLabel() {
    return this.generateInput('optional label', '(Label)', ['label']);
  },

  // appends a button for ttl and one for ctl
  appendTTLandCTL(elem) {
    // <button type="button">Click Me!</button>
    let ctlShown = false;
    const ctlInput = this.generateEvaluation('(CTL)', ['ctl']);
    const ctl = this.generateButton('CTL', () => {
      ctlShown = !ctlShown;
      if (ctlShown) {
        ctl.after(ctlInput);
      } else {
        ctlInput.parentNode.removeChild(ctlInput);
      }
    });
    let ttlShown = false;
    const ttlInput = this.generateExpression('(TTL)', ['ttl']);
    const ttl = this.generateButton('TTL', () => {
      ttlShown = !ttlShown;
      if (ttlShown) {
        ctl.after(ttlInput);
      } else {
        ttlInput.parentNode.removeChild(ttlInput);
      }
    });
    elem.appendChild(ttl);
    elem.appendChild(ctl);
  },

  // adds child elements to box
  expandBox(elem) {
    if (elem.classList.contains('action')) {
      // dropdown fast/slow
      elem.appendChild(this.generateSelection(['fast', 'slow'], ['Fast', 'Slow']));
      // input label
      const label = this.generateLabel();
      elem.appendChild(label);
      // new line
      const br = document.createElement('br');
      elem.appendChild(br);
      // TTL and CTL
      this.appendTTLandCTL(elem);
      // <div class="dropzone"></div>
      const div = document.createElement('div');
      div.classList.add('dropzone');
      elem.appendChild(div);
      HierarchyUtil.setChildren(div, []);
      HierarchyUtil.addToHierarchy(elem, div);
    } else if (elem.classList.contains('repeat')) {
      elem.appendChild(this.generateSelection(['fast', 'slow'], ['Fast', 'Slow']));
      // new line
      const br = document.createElement('br');
      elem.appendChild(br);
      // TTL and CTL
      this.appendTTLandCTL(elem);
      // times
      elem.appendChild(this.generateExpression('Times*', ['times']));
      // <div class="action"><div>Action</div></div>
      const actionDiv = document.createElement('div');
      actionDiv.classList.add('action');
      actionDiv.classList.add('static');
      elem.appendChild(actionDiv);
      const textDiv = document.createElement('div');
      textDiv.innerHTML = 'Action';
      textDiv.classList.add('blocktitle');
      actionDiv.appendChild(textDiv);
      HierarchyUtil.setChildren(actionDiv, []);
      HierarchyUtil.addToHierarchy(elem, actionDiv);
      this.expandBox(actionDiv);
    } else if (elem.classList.contains('wait')) {
      const conditionInput = this.generateInput('Condition', 'Condition', ['condition']);
      const timeInput = this.generateInput('Time', 'Time', ['time']);
      elem.appendChild(this.generateSelection(['time', 'condition'], ['Time', 'Condition'], (e) => {
        if (e.target.value === 'time') {
          conditionInput.after(timeInput);
          elem.removeChild(conditionInput);
        } else {
          timeInput.after(conditionInput);
          elem.removeChild(timeInput);
        }
      }));
      elem.appendChild(timeInput);
      // new line
      const br = document.createElement('br');
      elem.appendChild(br);
      // TTL and CTL
      this.appendTTLandCTL(elem);
    } else if (elem.classList.contains('spawn')) {
      this.appendTTLandCTL(elem);
      const enemyDiv = document.createElement('div');
      enemyDiv.classList.add('enemy');
      enemyDiv.classList.add('static');
      elem.appendChild(enemyDiv);
      const textDiv = document.createElement('div');
      textDiv.innerHTML = 'Enemy';
      textDiv.classList.add('blocktitle');
      enemyDiv.appendChild(textDiv);
      HierarchyUtil.setChildren(enemyDiv, []);
      HierarchyUtil.addToHierarchy(elem, enemyDiv);
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
