// main code for the levelEditor
/* global CreateUtil, copyToClipboard */

window.onload = () => {
  const rootNode = document.getElementById('root');
  rootNode.appendChild(CreateUtil.createBox('Action', true));
  const copyButton = document.createElement('button');
  copyButton.onclick = copyToClipboard;
  copyButton.innerHTML = 'Copy to Clipboard';
  rootNode.appendChild(copyButton);
};

