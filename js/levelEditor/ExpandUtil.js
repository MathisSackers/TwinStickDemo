// Manipulating element sizes, classes and content, also removing the trash
/* global HierarchyUtil */

const ExpandUtil = {
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
  appendTTLandCTL(e) {
    const elem = e;
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

  // adds child elements to <action>
  expandAction(elem) {
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
  },

  // adds child elements to <repeat>
  expandRepeat(elem) {
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
    this.expandAction(actionDiv);
  },

  // adds child elements to <wait>
  expandWait(elem) {
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
  },

  // adds child elements to <spawn>
  expandSpawn(elem) {
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
  },

  // adds child elements to <var>
  expandVariable(elem) {
    const valueInput = this.generateExpression('Value*', ['value']);
    elem.appendChild(this.generateSelection(['set', 'add', 'clear'], ['Set', 'Add', 'Clear'], (e) => {
      if (e.target.value === 'clear') {
        elem.removeChild(valueInput);
      } else if (valueInput.parentNode === null) {
        elem.appendChild(valueInput);
      }
    }));
    elem.appendChild(this.generateInput('Name', 'Name*', ['name']));
    elem.appendChild(valueInput);
  },
};
