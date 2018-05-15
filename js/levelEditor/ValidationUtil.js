// validates whether parts of the DOM are in correct format

const ValidationUtil = {
  // gathers all relevant DOM elements and validates them
  validateAll() {
    const inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i += 1) {
      const input = inputs[i];
      if (input.classList.contains('evaluation')) {
        this.validateEvaluation(input);
      } else if (input.classList.contains('expression')) {
        this.validateExpression(input);
      } else if (input.classList.contains('label') || input.classList.contains('name')) {
        this.validateString(input);
      } else {
        console.error('Invalid classList on input:');
        console.error(input);
      }
    }
  },

  // check if the value of the node contains only letters
  validateString(node) {
    const len = node.value.length;
    const matchlen = node.value.match(/[a-zA-Z]/g) === null ? 0 : node.value.match(/[a-zA-Z]/g).length;
    if (
      matchlen !== len
      || (len === 0 && !node.classList.contains('label'))
    ) {
      node.classList.add('error');
    } else {
      node.classList.remove('error');
    }
  },

  // check if the expression contains only valid characters
  validateExpression(node) {
    const len = node.value.length;
    const numvars = node.value.match(/\$(?=[a-zA-Z])/g) === null ? 0 : node.value.match(/\$(?=[a-zA-Z])/g).length;
    const numwords = node.value.match(/[a-zA-Z]+/g) === null ? 0 : node.value.match(/[a-zA-Z]+/g).length;
    const matchlen = node.value.match(/[a-zA-Z\s;.$\d+\-*_/()]/g) === null ? 0 : node.value.match(/[a-zA-Z\s;.$\d+\-*_/()]/g).length;
    if (
      matchlen !== len
      || (len === 0 && !node.classList.contains('optional'))
      || (numwords !== numvars)
    ) {
      node.classList.add('error');
    } else {
      node.classList.remove('error');
    }
  },

  // check if the evaluation contains only valid characters
  validateEvaluation(node) {
    const len = node.value.length;
    const numvars = node.value.match(/\$(?=[a-zA-Z])/g) === null ? 0 : node.value.match(/\$(?=[a-zA-Z])/g).length;
    const numwords = node.value.match(/[a-zA-Z]+/g) === null ? 0 : node.value.match(/[a-zA-Z]+/g).length;
    const matchlen = node.value.match(/[a-zA-Z\s;.$\d+\-*_/()&|=![\]]/g) === null ? 0 : node.value.match(/[a-zA-Z\s;.$\d+\-*_/()&|=![\]]/g).length;
    if (
      matchlen !== len
      || (node.value.length === 0 && !node.classList.contains('optional'))
      || (numwords !== numvars)
    ) {
      node.classList.add('error');
    } else {
      node.classList.remove('error');
    }
  },
};
