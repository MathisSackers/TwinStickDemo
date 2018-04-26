// Creating and expanding the DOM

const CreateUtil = {
  // appends the necessary HTML into elem
  buttonClick(elem, type) {
    const box = this.createBox(type);
    elem.after(box);
    if (elem.parentNode.classList.contains('action')) {
      const collapsable = this.createCollapsable();
      box.after(collapsable);
    }
  },

  // creates the wrapping div
  createBox(type, isStatic = false) {
    // <div class="type"><div>type</div></div>
    const outerDiv = document.createElement('div');
    outerDiv.classList.add(type.toLowerCase());
    outerDiv.classList.add('expanded');
    if (isStatic) {
      outerDiv.classList.add('static');
    } else {
      const deleteDiv = document.createElement('div');
      deleteDiv.classList.add('delete');
      deleteDiv.innerHTML = 'X';
      deleteDiv.onclick = () => {
        if (outerDiv.parentNode !== undefined) {
          if (outerDiv.nextSibling !== undefined && outerDiv.nextSibling.classList.contains('collapsed')) {
            outerDiv.parentNode.removeChild(outerDiv.nextSibling);
          }
          outerDiv.parentNode.removeChild(outerDiv);
        }
      };
      outerDiv.appendChild(deleteDiv);
    }
    const textDiv = document.createElement('div');
    textDiv.innerHTML = type;
    textDiv.classList.add('blocktitle');
    outerDiv.appendChild(textDiv);
    this.expandBox(outerDiv, isStatic);
    return outerDiv;
  },

  expandBox(elem, isStatic = false) {
    switch (elem.classList[0]) {
      case 'repeat':
        this.expandRepeat(elem);
        break;
      case 'action':
        this.expandAction(elem, isStatic);
        break;
      case 'wait':
        this.expandWait(elem);
        break;
      case 'variable':
        this.expandVariable(elem);
        break;
      case 'spawn':
        this.expandSpawn(elem);
        break;
      case 'enemy':
        this.expandEnemy(elem);
        break;
      default:
        console.error('Can\'t expand ', elem);
    }
  },

  // creates an HTML <select>
  generateSelection(values, texts, csss, onChange) {
    const select = document.createElement('select');
    csss.forEach((css) => {
      select.classList.add(css);
    });
    select.onchange = onChange;
    let counter = 0;
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      csss.forEach((css) => {
        option.classList.add(css);
      });
      option.innerHTML = texts[counter];
      counter += 1;
      select.appendChild(option);
    });
    return select;
  },

  // creates an HTML <button>
  generateButton(text, csss, onClick) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    csss.forEach((css) => {
      button.classList.add(css);
    });
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

  generateLabel(css = []) {
    css.push('label');
    return this.generateInput('optional label', '(Label)', css);
  },

  // appends a button for ttl and one for ctl
  appendTTLandCTL(e, css) {
    const elem = e;
    // <button type="button">Click Me!</button>
    let ctlShown = false;
    css.push('ctl');
    const ctlInput = this.generateEvaluation('(CTL)', css);
    css.pop();
    const ctl = this.generateButton('CTL', css, () => {
      ctlShown = !ctlShown;
      if (ctlShown) {
        ctl.after(ctlInput);
      } else {
        ctlInput.parentNode.removeChild(ctlInput);
      }
    });
    let ttlShown = false;
    css.push('ttl');
    const ttlInput = this.generateExpression('(TTL)', css);
    css.pop();
    const ttl = this.generateButton('TTL', css, () => {
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


  appendButton(elem, type) {
    // <div class="type buttons"><div class="blocktitle">Type</div></div>
    const outerDiv = document.createElement('div');
    outerDiv.classList.add(type.toLowerCase());
    outerDiv.classList.add('buttons');
    if (type !== 'Close') {
      outerDiv.onclick = () => { CreateUtil.buttonClick(elem, type); };
    }
    const textDiv = document.createElement('div');
    textDiv.innerHTML = type;
    textDiv.classList.add('blocktitle');
    outerDiv.appendChild(textDiv);
    elem.appendChild(outerDiv);
  },

  createCollapsable() {
    // <div class="collapsed">Buttons</div>
    const collapsable = document.createElement('div');
    collapsable.classList.add('collapsed');
    collapsable.onclick = () => { collapsable.classList.toggle('collapsed'); };
    this.appendButton(collapsable, 'Action');
    this.appendButton(collapsable, 'Repeat');
    this.appendButton(collapsable, 'Wait');
    this.appendButton(collapsable, 'Spawn');
    this.appendButton(collapsable, 'Variable');
    this.appendButton(collapsable, 'Close');
    return collapsable;
  },

  // adds child elements to <action>
  expandAction(elem, isStatic = false) {
    const css = ['action'];
    if (isStatic) {
      css.push('static');
    }
    // dropdown fast/slow
    elem.appendChild(this.generateSelection(['fast', 'slow'], ['Fast', 'Slow'], css));
    // input label
    const label = this.generateLabel(css);
    elem.appendChild(label);
    // new line
    const br = document.createElement('br');
    elem.appendChild(br);
    // TTL and CTL
    this.appendTTLandCTL(elem, css);
    const collapsable = this.createCollapsable();
    elem.appendChild(collapsable);
  },

  // adds child elements to <repeat>
  expandRepeat(elem) {
    elem.appendChild(this.generateSelection(['fast', 'slow'], ['Fast', 'Slow'], ['repeat']));
    // new line
    const br = document.createElement('br');
    elem.appendChild(br);
    // TTL and CTL
    this.appendTTLandCTL(elem, ['repeat']);
    // times
    elem.appendChild(this.generateExpression('Times*', ['times']));
    const actionDiv = this.createBox('Action', true);
    elem.appendChild(actionDiv);
  },

  // adds child elements to <wait>
  expandWait(elem) {
    const conditionInput = this.generateInput('Condition', 'Condition', ['condition', 'wait']);
    const timeInput = this.generateInput('Time', 'Time', ['time', 'wait']);
    elem.appendChild(this.generateSelection(['time', 'condition'], ['Time', 'Condition'], ['wait'], (e) => {
      if (e.target.value === 'time') {
        conditionInput.after(timeInput);
        elem.removeChild(conditionInput);
      } else {
        timeInput.after(conditionInput);
        elem.removeChild(timeInput);
      }
    }));
    elem.appendChild(timeInput);
  },

  // adds child elements to <spawn>
  expandSpawn(elem) {
    this.appendTTLandCTL(elem, ['spawn']);
    const enemyDiv = document.createElement('div');
    enemyDiv.classList.add('enemy');
    enemyDiv.classList.add('static');
    elem.appendChild(enemyDiv);
    const textDiv = document.createElement('div');
    textDiv.innerHTML = 'Enemy';
    textDiv.classList.add('blocktitle');
    enemyDiv.appendChild(textDiv);
  },

  // adds child elements to <var>
  expandVariable(elem) {
    const valueInput = this.generateExpression('Value*', ['value', 'variable']);
    elem.appendChild(this.generateSelection(['set', 'add', 'clear'], ['Set', 'Add', 'Clear'], ['variable'], (e) => {
      if (e.target.value === 'clear') {
        elem.removeChild(valueInput);
      } else if (valueInput.parentNode === null) {
        elem.appendChild(valueInput);
      }
    }));
    elem.appendChild(this.generateInput('Name', 'Name*', ['name', 'variable']));
    elem.appendChild(valueInput);
  },
};
