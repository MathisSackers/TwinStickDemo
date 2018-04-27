// functions that are offered by buttons
/* global DOMtoStringUtil, ValidationUtil */


// walk the hierarchy and format it into level data
function copyToClipboard() {
  ValidationUtil.validateAll();
  const string = DOMtoStringUtil.nodeToString(document.getElementById('root'));
  const myDocument = document.createElement('textarea');
  document.body.appendChild(myDocument);
  myDocument.value = string;
  myDocument.select();
  document.execCommand('copy');
  document.body.removeChild(myDocument);
}
