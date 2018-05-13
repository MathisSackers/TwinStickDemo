// Evaluation of TEXTs

// Contents ##, 0xXXXXXX, \n*, (EXPRESSION)*, CHARACTER*
// where CHARACTER is any ASCII(?) character

// Example
// This text is ignored #This text is returned#
// #This text ##is split in two!#
// #You can display variables like this: ($variable)#
// #\(Show brackets by escaping them \#alsoHashtags\)#
// #0xffff00 This text is yellow#

// default color for texts
const DEFAULT_TEXT_COLOR = 0xe1ddcf;

const LevelText = {
  eval(text) {
    // clean string
    let t = this.findContet(text);
    t = this.color(t);
    t = this.newlines(t);
    t = this.expressions(t);
    t = this.slashes(t);
    return t;
  },

  findContet(text) {
    const texts = [];
    let inside = false;
    let t = '';
    for (let i = 0; i < text.length; i += 1) {
      if (text.charAt(i) === '#' && (i === 0 || text.charAt(i - 1) !== '\\')) {
        // end or beginning of text
        inside = !inside;
        if (!inside) {
          texts.push({
            text: t,
            color: DEFAULT_TEXT_COLOR,
            newline: false,
            needsUpdates: false,
          });
          t = '';
        }
      } else if (inside) {
        // normal char
        t = t.concat(text.charAt(i));
      }
    }
    return texts;
  },

  color(texts) {
    const t = texts;
    for (let i = 0; i < texts.length; i += 1) {
      if (t[i].text.search(/0x[a-zA-Z0-9]{6}/) === 0) {
        t[i].color = '#'.concat(t[i].text.slice(2, 8));
        if (t[i].text.charAt(9) === ' ') {
          t[i].text = t[i].text.slice(9);
        } else {
          t[i].text = t[i].text.slice(8);
        }
      }
    }
    return t;
  },

  newlines(texts) {
    const t = texts;
    let i = 0;
    while (i < texts.length) {
      const index = t[i].text.indexOf('\\n');
      if (index !== -1) {
        const first = t[i].text.slice(0, index);
        const second = t[i].text.slice(index + 2);
        const clone = Object.assign({}, t[i]);
        t[i].text = first;
        t[i].newline = true;
        clone.text = second;
        t.splice(i + 1, 0, clone);
      }
      i += 1;
    }
    return t;
  },

  expressions(texts) {
    const t = texts;
    for (let i = 0; i < texts.length; i += 1) {
      let depth = 0;
      const brackets = [];
      for (let j = 0; j < t[i].text.length; j += 1) {
        if (
          t[i].text.charAt(j) === '('
          && (j !== 0
            || t[i].text.charAt(j - 1) !== '\\')
        ) {
          depth += 1;
          if (depth === 1) {
            brackets.push(j);
          }
        } else if (
          t[i].text.charAt(j) === ')'
          && (j !== 0
            || t[i].text.charAt(j - 1) !== '\\')
        ) {
          depth -= 1;
          if (depth === 0) {
            brackets.push(j);
          } else if (depth < 0) {
            console.error(`Unexpected ')' in ${t[i].text} at Column ${j + 1}.`);
          }
        }
      }
      if (brackets.length % 2 === 1) {
        console.error(`Bracket mismatch in ${t[i].text}`);
      }
      let newText = '';
      for (let j = 0; j < brackets.length; j += 2) {
        let before = 0;
        let after = t[i].text.length;
        if (j > 0) {
          before = brackets[j - 1];
        }
        if (j < brackets.length - 1) {
          after = brackets[j + 2];
        }
        newText = newText.concat(t[i].text.slice(before, brackets[j]));
        newText = newText
          .concat(String(LevelExpression.eval(t[i].text.slice(brackets[j], brackets[j + 1] + 1))));
        newText = newText.concat(t[i].text.slice(brackets[j + 1] + 1, after));
      }
      if (newText.length !== 0) {
        t[i].text = newText;
        t[i].needsUpdates = true;
      }
    }
    return t;
  },

  slashes(texts) {
    const t = texts;
    for (let i = 0; i < texts.length; i += 1) {
      let newText = '';
      for (let j = 0; j < t[i].text.length; j += 1) {
        let skipped = false;
        if (t[i].text.charAt(j) === '\\' && !skipped) {
          skipped = true;
        } else {
          skipped = false;
          newText = newText.concat(t[i].text.charAt(j));
        }
      }
      t[i].text = newText;
    }
    return t;
  },
};
