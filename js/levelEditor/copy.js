// code to convert the nodes into text and copy them to clipboard
/* global HierarchyUtil */

// print indented and with newline
function line(text, depth) {
  const string = ' '.repeat(depth);
  return string.concat(text.concat('\n'));
}

// check if the label contains only letters
function checkLabel(node) {
  if (node.value.match(/[a-zA-Z]/g).length !== node.value.length) {
    node.classList.add('error');
    return false;
  }
  return true;
}

// check if the expression contains only valid characters and format it to XML-friendly
function scanExpression(string) {
  const val = string.replace('<', '&lt;')
    .replace('>', '&gt;');
  if (val === null || val.length === 0) {
    return { val: '', err: true };
  }
  return { val, err: val.match(/[a-zA-Z\s;.$\d+\-*_/()]/g).length !== val.length };
}

// check if the evaluation contains only valid characters and format it to XML-friendly
function scanEvaluation(string) {
  const val = string.replace('&', '&amp;')
    .replace('<', '&lt;')
    .replace('>', '&gt;');
  if (val === null || val.length === 0) {
    return { val: '', err: true };
  }
  return { val, err: val.match(/[a-zA-Z\s;.$\d+\-*_/()&|=![\]]/g).length !== val.length };
}

// checks whether the node is <TTL> or <CTL> and returns the line to print
function TTLorCTL(node) {
  if (node.classList.contains('ttl')) {
    const { val, err } = scanExpression(node.value);
    if (err) {
      node.classList.add('error');
    }
    return `<ttl>${val}</ttl>`;
  }
  const { val, err } = scanEvaluation(node.value);
  if (err) {
    node.classList.add('error');
  }
  return `<ctl>${val}</ctl>`;
}

// recursive function that walks through the hierarchy and returns a string representation of it.
function getNode(node, depth = 0) {
  let d = depth;
  let string = '';
  if (node.classList.contains('main')) {
    string = string.concat(line('<document>', d));
  } else if (node.classList.contains('action')) {
    if (node.children[2].value.length > 0) {
      checkLabel(node.children[2]);
      string = string.concat(line(`<action type='${node.children[1].value}' label='${node.children[2].value}'>`, d));
    } else {
      string = string.concat(line(`<action type='${node.children[1].value}'>`, d));
    }
    if ((node.children[6].classList.contains('ctl')
      || node.children[6].classList.contains('ttl'))
      && node.children[6].value.length !== 0
    ) {
      string = string.concat(line(TTLorCTL(node.children[6]), d));
      if ((node.children[7].classList.contains('ctl')
        || node.children[7].classList.contains('ttl'))
        && node.children[7].value.length !== 0
      ) {
        string = string.concat(line(TTLorCTL(node.children[7]), d));
      }
    }
    d += 1;
  } else if (node.classList.contains('repeat')) {
    string = string.concat(line(`<repeat type='${node.children[1].value}'>`, d));
    if ((node.children[5].classList.contains('ctl')
      || node.children[5].classList.contains('ttl'))
      && node.children[5].value.length !== 0
    ) {
      string = string.concat(line(TTLorCTL(node.children[5]), d));
      if ((node.children[6].classList.contains('ctl')
        || node.children[6].classList.contains('ttl'))
        && node.children[6].value.length !== 0
      ) {
        string = string.concat(line(TTLorCTL(node.children[6]), d));
      }
    }
    for (let i = 5; i <= 7; i += 1) {
      if (node.children[i] !== undefined && node.children[i].classList.contains('times')) {
        const { val, err } = scanExpression(node.children[i].value);
        if (err || val.length === 0) {
          node.children[i].classList.add('error');
        }
        string = string.concat(line(`<times>${val}</times>`, d));
      }
    }
    d += 1;
  } else if (node.classList.contains('wait')) {
    let result = {};
    if (node.children[2].classList.contains('time')) {
      result.type = 'time';
      result = scanExpression(node.children[2].value);
    } else {
      result.type = 'condition';
      result = scanEvaluation(node.children[2].value);
    }
    if (result.err || result.val.length === 0) {
      node.children[2].classList.add('error');
    }
    string = string.concat(line(`<wait type='${result.type}'>${result.val}</wait>`, d));
  } else if (node.classList.contains('spawn')) {
    string = string.concat(line('<spawn>', d));
    d += 1;
  } else if (node.classList.contains('enemy')) {
    string = string.concat(line('<enemy></enemy>', d));
  } else if (node.classList.contains('variable')) {
    if (node.children[2].value.length === 0) {
      node.children[2].classList.add('error');
    }
    if (node.children[1].value === 'clear') {
      string = string.concat(line(`<var type='${node.children[1].value}' name='${node.children[2].value}'></var>`, d));
    } else {
      const { val, err } = scanExpression(node.children[3].value);
      if (err || val.length === 0) {
        node.children[3].classList.add('error');
      }
      string = string.concat(line(`<var type='${node.children[1].value}' name='${node.children[2].value}'>${val}</var>`, d));
    }
  }
  // add the children into the middle
  HierarchyUtil.getChildren(node).forEach((child) => {
    string = string.concat(getNode(child, d));
  });
  // add the closing tag
  if (node.classList.contains('main')) {
    string = string.concat(line('</document>', d));
  } else if (node.classList.contains('action')) {
    string = string.concat(line('</action>', d - 1));
  } else if (node.classList.contains('repeat')) {
    string = string.concat(line('</repeat>', d - 1));
  } else if (node.classList.contains('spawn')) {
    string = string.concat(line('</spawn>', d - 1));
  }
  return string;
}

// walk the hierarchy and format it into level data
function copyToClipboard() {
  const string = getNode(document.getElementById('main'));
  const myDocument = document.createElement('textarea');
  document.body.appendChild(myDocument);
  myDocument.value = string;
  myDocument.select();
  document.execCommand('copy');
  document.body.removeChild(myDocument);
}
