// Evaluation of EXPRESSIONs

// Contents - (), +, -, /, *, _, %, NUMBER, $rand, $clt, $pi, $playerNum, $rank, $var
// where NUMBER is any real number

// Example
// 34
// 360/16
// 0.7 + (0.9 * $rand)
// 180-_($rank*20)
// (2+$myvariable)*0.3


const LevelExpression = {
  eval(expression) {
    // clean string
    let exp = expression.toLowerCase().replace(/\s/g, '');
    exp = this.evalBrackets(exp);
    exp = this.evalKeywords(exp);
    exp = this.evalFloor(exp);
    exp = this.evalMath(exp, '*');
    exp = this.evalMath(exp, '/');
    exp = this.evalMath(exp, '%');
    exp = this.evalMath(exp, '+');
    exp = this.evalMath(exp, '-');
    return Number(exp);
  },

  // returns the number that starts at i and returns it and the index where it ends
  getNumber(exp, start, backwards = false) {
    if (backwards) {
      let i = start;
      while (i >= 0 && exp.charAt(i).match(/\d|\./) !== null) {
        i -= 1;
      }
      if (i === start) {
        // no number, return 0 (for '-5')
        return [0, i + 1];
      }
      return [Number(exp.substring(i + 1, start + 1)), i + 1];
    }
    // forward
    let i = start;
    while (i < exp.length && exp.charAt(i).match(/\d|\./) !== null) {
      i += 1;
    }
    if (i === start) {
      if (exp.charAt(i) === '-' && exp.length > i && exp.charAt(i + 1) !== '-') {
        // negative number
        const [num, newEnd] = this.getNumber(exp, start + 1);
        return [Number(-num), newEnd + 1];
      }
      // no number throw error
      console.error(`Expected a number in ${exp} at Column ${start}`);
    }
    return [Number(exp.substring(start, i)), i - start];
  },

  // returns the string that starts at i and returns it and the index where it ends
  getString(exp, start) {
    let i = start;
    while (i < exp.length && exp.charAt(i).match(/[a-z]/) !== null) {
      i += 1;
    }
    return [exp.substring(start, i), i - start];
  },

  evalBrackets(exp) {
    // find brackets
    let depth = 0;
    const bracketExpressions = [];
    for (let i = 0; i < exp.length; i += 1) {
      if (exp.charAt(i) === '(') {
        depth += 1;
        if (depth === 1) {
          bracketExpressions.push(i);
        }
      } else if (exp.charAt(i) === ')') {
        depth -= 1;
        if (depth === 0) {
          bracketExpressions.push(i);
        } else if (depth < 0) {
          console.error(`Unexpected ')' in ${exp} at Column ${i + 1}`);
        }
      }
    }
    if (bracketExpressions.length % 2 === 1) {
      console.error(`Bracket mismatch in ${exp}`);
    }
    // evaluate brackets
    let bracket = false;
    let bracketExpression = '';
    let noBracketExpression = '';
    for (let i = 0; i < exp.length; i += 1) {
      // switch the current target
      if (bracketExpressions.includes(i)) {
        // we are leaving the bracket
        if (bracket) {
          noBracketExpression = noBracketExpression
            .concat(this.eval(bracketExpression).toString());
          bracketExpression = '';
        }
        // switch into/out of bracket
        bracket = !bracket;
      } else if (bracket) {
        bracketExpression = bracketExpression.concat(exp.charAt(i));
      } else {
        noBracketExpression = noBracketExpression.concat(exp.charAt(i));
      }
    }
    return noBracketExpression;
  },

  evalFloor(exp) {
    let noFloorExpression = '';
    // find _
    for (let i = 0; i < exp.length; i += 1) {
      if (exp.charAt(i) === '_') {
        // floor following value
        const [num, j] = this.getNumber(exp, i + 1);
        i += j;
        noFloorExpression = noFloorExpression.concat(Math.floor(num).toString());
      } else {
        noFloorExpression = noFloorExpression.concat(exp.charAt(i));
      }
    }
    return noFloorExpression;
  },

  // evaluates $rand, $clt, $playerNum, $totalPlayerNum, $rank and $vars
  evalKeywords(exp) {
    let noKeywordsExpression = '';
    // find $
    for (let i = 0; i < exp.length; i += 1) {
      if (exp.charAt(i) === '$') {
        // replace following string
        const [keyword, j] = this.getString(exp, i + 1);
        i += j;
        if (keyword === 'rand') {
          noKeywordsExpression = noKeywordsExpression.concat(Math.random().toString());
        } else if (keyword === 'clt') {
          noKeywordsExpression = noKeywordsExpression.concat(this.clt().toString());
        } else if (keyword === 'pi') {
          noKeywordsExpression = noKeywordsExpression.concat(Math.PI.toString());
        } else if (game.levelmachine.variables[keyword] !== undefined) {
          noKeywordsExpression = noKeywordsExpression
            .concat(game.levelmachine.variables[keyword].toString());
        } else {
          console.error(`Unknown keyword ${keyword}`);
        }
      } else {
        noKeywordsExpression = noKeywordsExpression.concat(exp.charAt(i));
      }
    }
    return noKeywordsExpression;
  },

  // Random number with 0.5 being most probable
  // https://en.wikipedia.org/wiki/Central_limit_theorem
  clt() {
    let rand = 0;
    for (let i = 0; i < 4; i += 1) {
      rand += Math.random();
    }
    return rand / 4;
  },

  evalMath(exp, token) {
    // find first token
    let e = exp;
    let i = 0;
    while (i < exp.length && e === exp) {
      if (exp.charAt(i) === token) {
        // replace the number before and after
        const [first, start] = this.getNumber(exp, i - 1, true);
        const [second, end] = this.getNumber(exp, i + 1);
        // do math
        let solution;
        if (token === '*') {
          solution = first * second;
        } else if (token === '/') {
          solution = first / second;
        } else if (token === '%') {
          solution = first % second;
        } else if (token === '+') {
          solution = first + second;
        } else if (token === '-') {
          solution = first - second;
        }
        // slice it inside
        e = exp.slice(0, start)
          .concat((solution).toString()
            .concat(exp.slice(i + end + 1, exp.length)));
      }
      i += 1;
    }
    if (e !== exp) {
      return this.evalMath(e, token);
    }
    return e;
  },
};
