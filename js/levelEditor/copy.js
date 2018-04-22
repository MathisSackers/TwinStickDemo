// code to convert the nodes into text and copy them to clipboard
/* global HierarchyUtil */

function line(text, depth) {
  const string = ' '.repeat(depth);
  return string.concat(text.concat('\n'));
}

function getNode(node, depth = 0) {
  let d = depth;
  let string = '';
  if (node.classList.contains('action')) {
    string = string.concat(line('<action>', d));
    d += 1;
  } else if (node.classList.contains('repeat')) {
    string = string.concat(line('<repeat>', d));
    d += 1;
  } else if (node.classList.contains('wait')) {
    string = string.concat(line('<wait>', d));
    d += 1;
  } else if (node.classList.contains('spawn')) {
    string = string.concat(line('<spawn>', d));
    d += 1;
  } else if (node.classList.contains('enemy')) {
    string = string.concat(line('<enemy>', d));
    d += 1;
  }
  HierarchyUtil.getChildren(node).forEach((child) => {
    string = string.concat(getNode(child, d));
  });
  if (node.classList.contains('action')) {
    string = string.concat(line('</action>', d - 1));
  } else if (node.classList.contains('repeat')) {
    string = string.concat(line('</repeat>', d - 1));
  } else if (node.classList.contains('wait')) {
    string = string.concat(line('</wait>', d - 1));
  } else if (node.classList.contains('spawn')) {
    string = string.concat(line('</spawn>', d - 1));
  } else if (node.classList.contains('enemy')) {
    string = string.concat(line('</enemy>', d - 1));
  }
  return string;
}

function copyToClipboard() {
  const string = getNode(document.getElementById('main'));
  const myDocument = document.createElement('textarea');
  document.body.appendChild(myDocument);
  myDocument.value = string;
  myDocument.select();
  document.execCommand('copy');
  document.body.removeChild(myDocument);
}
