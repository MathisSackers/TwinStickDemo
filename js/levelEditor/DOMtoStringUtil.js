// taking DOM elements and converting them to string format

const DOMtoStringUtil = {
  // recursively transforms this node and children into string representation
  nodeToString(node, d = 0) {
    if (node.classList.contains('document')) {
      return this.documentToString(node, d);
    } else if (node.classList.contains('action')) {
      return this.actionToString(node, d);
    } else if (node.classList.contains('repeat')) {
      return this.repeatToString(node, d);
    } else if (node.classList.contains('wait')) {
      return this.waitToString(node, d);
    } else if (node.classList.contains('spawn')) {
      return this.spawnToString(node, d);
    } else if (node.classList.contains('variable')) {
      return this.variableToString(node, d);
    }
    console.error(`Unknown node: ${node}`);
    return '';
  },

  // recursively transforms <document> and children into string representation
  documentToString(node, d) {
    let string = this.line('<document>', d);
    string = string.concat(this.nodeToString(node.children[1], d + 1));
    return string.concat(this.line('</document>', d));
  },

  // recursively transforms <action> and children into string representation
  actionToString(node, d) {
    let string = '';
    let offset = 1;
    if (node.classList.contains('static')) {
      // static actions do not have the delete button
      offset = 0;
    }
    const label = node.children[2 + offset].value;
    if (label.length > 0) {
      string = this.line(`<action type='${node.children[1 + offset].value}' label='${label}'>`, d);
    } else {
      string = this.line(`<action type='${node.children[1 + offset].value}'>`, d);
    }
    this.TTLorCTL(node.children[6 + offset], node.children[7 + offset]).forEach((line) => {
      string = string.concat(this.line(line, d + 1));
    });
    for (let i = 0; i < node.children.length; i += 1) {
      const child = node.children[i];
      if (child.classList.contains('expanded')) {
        string = string.concat(this.nodeToString(child, d + 1));
      }
    }
    return string.concat(this.line('</action>', d));
  },

  // recursively transforms <repeat> and children into string representation
  repeatToString(node, d) {
    let string = this.line(`<repeat type='${node.children[2].value}'>`, d);
    this.TTLorCTL(node.children[6], node.children[7]).forEach((line) => {
      string = string.concat(this.line(line, d + 1));
    });
    string = string.concat(this.line(`<times>${this.replaceTokens(node.children[node.children.length - 2].value)}</times>`, d + 1));
    string = string.concat(this.actionToString(node.children[node.children.length - 1], d + 1));
    return string.concat(this.line('</repeat>', d));
  },

  // transforms <wait> into string representation
  waitToString(node, d) {
    return this.line(`<wait type='${node.children[2].value}'>${this.replaceTokens(node.children[3].value)}</wait>`, d);
  },

  // transforms <spawn> and its children into string representation
  spawnToString(node, d) {
    let string = this.line('<spawn>', d);
    this.TTLorCTL(node.children[4], node.children[5]).forEach((line) => {
      string = string.concat(this.line(line, d + 1));
    });
    string = string.concat(this.line('<enemy/>', d + 1));
    return string.concat(this.line('</spawn>', d));
  },

  // transforms <var> into string representation
  variableToString(node, d) {
    return this.line(`<var type='${node.children[2].value}' name ='${node.children[3].value}'>${this.replaceTokens(node.children[4].value)}</var>`, d);
  },

  // print indented and with newline
  line(text, depth) {
    if (text.length > 0) {
      const string = '\t'.repeat(depth);
      return string.concat(text.concat('\n'));
    }
    return '';
  },

  // formats the string to be XML-friendly
  replaceTokens(string) {
    return string.replace('&', '&amp;')
      .replace('<', '&lt;')
      .replace('>', '&gt;');
  },

  // checks whether the nodes are <TTL> or <CTL> and returns the lines in an array
  TTLorCTL(node1, node2) {
    const a = [];
    if (node1 !== undefined) {
      if (node1.classList.contains('ttl')) {
        a.push(`<ttl>${this.replaceTokens(node1.value)}</ttl>`);
      } else if (node1.classList.contains('ctl')) {
        a.push(`<ctl>${this.replaceTokens(node1.value)}</ctl>`);
      }
    }
    if (node2 !== undefined) {
      if (node2.classList.contains('ttl')) {
        a.push(`<ttl>${this.replaceTokens(node2.value)}</ttl>`);
      } else if (node2.classList.contains('ctl')) {
        a.push(`<ctl>${this.replaceTokens(node2.value)}</ctl>`);
      }
    }
    return a;
  },
};
