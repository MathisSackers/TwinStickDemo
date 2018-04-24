// Evaluation of EVALUATIONs

// Contents [], !, &, |, ->, <-, <->, ==, !=, <=, >=, <, >, $true, $false, $rand
// you can see the prioritisation below

// Example
// 4 == $playerNum
// $rand | $rand
// $rand < 0.7 & $myvar == 0
// ![$myvar == 0 & $rand] <-> $secondVar * $thirdVar < 9

// [] = brackets for logical expression; () are already used for EXPRESSIONs
// ! = logical not, only unary operator
// &, |, -> = logical and, or and implies, binary operators, expecting EVALUATIONs
// <-, <-> = logical implies and iff, binary operators, expecting EVALUATIONs
// ==, != = equal and uneaqual, binary operators, expecting EXPRESSIONs
// <=, >= = smaller-equal and greater-equal, binary operators, expecting EXPRESSIONs
// <, > = smaller and greater, binary operators, expecting EXPRESSIONs
// $true = always True
// $false = always False
// $rand = True or False, 50/50

const LevelEvaluation = {
  eval(evaluation) {
    // clean string
    let eva = evaluation.replace(/\s/g, '')
      .replace('&lt;', '<')
      .replace('&gt;', '>')
      .replace('&amp;', '&')
      .replace('&apos;', '\'')
      .replace('&quot;', '"');
    eva = this.evalBrackets(eva);
    eva = this.evalMath(eva, '==');
    eva = this.evalMath(eva, '!=');
    eva = this.evalMath(eva, '<=');
    eva = this.evalMath(eva, '>=');
    eva = this.evalMath(eva, '<');
    eva = this.evalMath(eva, '>');
    eva = this.evalKeywords(eva);
    eva = this.evalNot(eva);
    eva = this.evalShortLogic(eva, '&');
    eva = this.evalShortLogic(eva, '|');
    eva = this.evalIff(eva);
    eva = this.evalImplies(eva);
    return eva === '$true';
  },

  // returns the expression that starts at i and returns it and the index where it ends
  getExpression(eva, start, backwards = false) {
    if (backwards) {
      let i = start;
      while (i >= 0 && eva.charAt(i).match(/\[\]!&|=-<>/) === null) {
        i -= 1;
      }
      let head = '';
      let end = i;
      if (eva.charAt(i) === '-') {
        // might just be a math-minus
        if (
          (i < start && eva.charAt(i + 1).match(/<>/) === null)
          || (i > 0 && eva.charAt(i - 1).match(/<>/) === null)
        ) {
          // was indeed just a math minus
          let tmp = '';
          [tmp, end] = this.getExpression(eva, i - 1, backwards);
          head = head.concat(tmp.concat('-'));
        }
      }
      if (i === start) {
        // no expression
        console.error(`Expected an expression in ${eva} ending at Column ${start}`);
      }
      return [head.concat(eva.substring(i + 1, start + 1)), end + 1];
    }
    // forward
    let i = start;
    while (i < eva.length && eva.charAt(i).match(/\[\]!&|=-<>/) === null) {
      i += 1;
    }
    let ending = '';
    let end = i;
    if (eva.charAt(i) === '-') {
      // might just be a math-minus
      if (
        (i > start && eva.charAt(i + 1).match(/<>/) === null)
        || (i > 0 && eva.charAt(i - 1).match(/<>/) === null)
      ) {
        // was indeed just a math minus
        let tmp = '';
        [tmp, end] = this.getExpression(eva, i + 1, backwards);
        ending = ending.concat('-'.concat(tmp));
      }
    }
    if (i === start) {
      // no expression
      console.error(`Expected a number in ${eva} at Column ${start}`);
    }
    return [eva.substring(start, i).concat(ending), end];
  },

  // returns the number that starts at i and returns it and the index where it ends
  getAndEvalExpression(eva, start, backwards = false) {
    const [exp, end] = this.getExpression(eva, start, backwards);
    return [LevelExpression.eval(exp), end];
  },

  evalBrackets(eva) {
    // find brackets
    let depth = 0;
    const bracketEvaluations = [];
    for (let i = 0; i < eva.length; i += 1) {
      if (eva.charAt(i) === '[') {
        depth += 1;
        if (depth === 1) {
          bracketEvaluations.push(i);
        }
      } else if (eva.charAt(i) === ']') {
        depth -= 1;
        if (depth === 0) {
          bracketEvaluations.push(i);
        } else if (depth < 0) {
          console.error(`Unexpected ']' in ${eva} at Column ${i + 1}`);
        }
      }
    }
    if (bracketEvaluations.length % 2 === 1) {
      console.error(`Bracket mismatch in ${eva}`);
    }
    // evaluate brackets
    let bracket = false;
    let bracketEvaluation = '';
    let noBracketEvaluation = '';
    for (let i = 0; i < eva.length; i += 1) {
      // switch the current target
      if (bracketEvaluations.includes(i)) {
        // we are leaving the bracket
        if (bracket) {
          noBracketEvaluation = noBracketEvaluation
            .concat(this.eval(bracketEvaluation) ? '$true' : '$false');
          bracketEvaluation = '';
        }
        // switch into/out of bracket
        bracket = !bracket;
      } else if (bracket) {
        bracketEvaluation = bracketEvaluation.concat(eva.charAt(i));
      } else {
        noBracketEvaluation = noBracketEvaluation.concat(eva.charAt(i));
      }
    }
    return noBracketEvaluation;
  },

  evalMath(eva, token) {
    // find first token
    let e = eva;
    let i = 0;
    while (i < eva.length && e === eva) {
      if (
        eva.charAt(i) === token.charAt(0)
        && (token.length === 1
          || (token.length === 2
            && eva.length > i
            && eva.charAt(i + 1) === token.charAt(1)))
        && (token !== '<' || eva.charAt(i + 1) !== '-')
        && (token !== '>' || eva.charAt(i - 1) !== '-')
      ) {
        // replace the expression before and after
        const [first, start] = this.getAndEvalExpression(eva, i - 1, true);
        const [second, end] = this.getAndEvalExpression(eva, i + token.length);
        // do math
        let solution;
        switch (token) {
          case '==':
            solution = first === second ? '$true' : '$false';
            break;
          case '!=':
            solution = first !== second ? '$true' : '$false';
            break;
          case '<=':
            solution = first <= second ? '$true' : '$false';
            break;
          case '>=':
            solution = first >= second ? '$true' : '$false';
            break;
          case '<':
            solution = first < second ? '$true' : '$false';
            break;
          case '>':
            solution = first > second ? '$true' : '$false';
            break;
          default:
            console.error(`Unknown token: ${token}`);
        }
        // slice it inside
        e = eva.slice(0, start)
          .concat(solution.concat(eva.slice(end, eva.length)));
      }
      i += 1;
    }
    if (e !== eva) {
      return this.evalMath(e, token);
    }
    return e;
  },

  // returns the string that starts at i and returns it and the strings length
  getString(eva, start, backwards = false) {
    let i = start;
    if (backwards) {
      while (i >= 0 && eva.charAt(i).match(/[a-zA-Z]/) !== null) {
        i -= 1;
      }
      if (i >= 0 && eva.charAt(i) === '$') {
        return [eva.substring(i + 1, start + 1), start - i];
      }
      console.error(`Expected $ in ${eva} at Column ${i}`);
    }
    while (i < eva.length && eva.charAt(i).match(/[a-zA-Z]/) !== null) {
      i += 1;
    }
    return [eva.substring(start, i), i - start];
  },

  // evaluates $rand
  evalKeywords(eva) {
    let noKeywordsEvaluation = '';
    // find $
    for (let i = 0; i < eva.length; i += 1) {
      if (eva.charAt(i) === '$') {
        // replace following string
        const [keyword, j] = this.getString(eva, i + 1);
        i += j;
        switch (keyword) {
          case 'rand':
            noKeywordsEvaluation = noKeywordsEvaluation.concat(Math.random() < 0.5 ? '$true' : '$false');
            break;
          case 'false':
            noKeywordsEvaluation = noKeywordsEvaluation.concat('$false');
            break;
          case 'true':
            noKeywordsEvaluation = noKeywordsEvaluation.concat('$true');
            break;
          default:
            console.error(`Unknown keyword ${keyword}`);
        }
      } else {
        noKeywordsEvaluation = noKeywordsEvaluation.concat(eva.charAt(i));
      }
    }
    return noKeywordsEvaluation;
  },

  evalNot(eva) {
    let noNotEvaluation = '';
    // find !
    for (let i = 0; i < eva.length; i += 1) {
      if (eva.charAt(i) === '!') {
        if (eva.length > i && eva.charAt(i + 1) === '$') {
          // invert following value
          const [str, j] = this.getString(eva, i + 2);
          i += j + 1;
          noNotEvaluation = noNotEvaluation.concat(str === 'false' ? '$true' : '$false');
        } else {
          console.error(`Expected $true or $false in ${eva} at Column ${i + 1}`);
        }
      } else {
        noNotEvaluation = noNotEvaluation.concat(eva.charAt(i));
      }
    }
    return noNotEvaluation;
  },

  evalShortLogic(eva, token) {
    let e = eva;
    // find token
    let i = 0;
    while (i < eva.length && e === eva) {
      if (eva.charAt(i) === token) {
        if (eva.length > i && eva.charAt(i + 1) === '$') {
          // logical and with preceeding and following value
          const [first, length1] = this.getString(eva, i - 1, true);
          const [second, length2] = this.getString(eva, i + 2);
          let fill;
          switch (token) {
            case '&':
              fill = (first === 'true') && (second === 'true') ? '$true' : '$false';
              break;
            case '|':
              fill = (first === 'true') || (second === 'true') ? '$true' : '$false';
              break;
            default:
              console.error(`Unknown token ${token}`);
          }
          // slice it inside
          e = eva.slice(0, i - (length1 + 1))
            .concat(fill
              .concat(eva.slice(i + length2 + 2, eva.length)));
        } else {
          console.error(`Expected $true or $false in ${eva} at Column ${i + 1}`);
        }
      }
      i += 1;
    }
    if (e !== eva) {
      return this.evalShortLogic(e, token);
    }
    return e;
  },

  evalIff(eva) {
    let e = eva;
    // find <->
    let i = 0;
    while (i < eva.length - 3 && e === eva) {
      if (eva.charAt(i) === '<' && eva.charAt(i + 1) === '-' && eva.charAt(i + 2) === '>') {
        if (eva.length > i && eva.charAt(i + 3) === '$') {
          // logical iff preceeding and following value
          const [first, length1] = this.getString(eva, i - 1, true);
          const [second, length2] = this.getString(eva, i + 4);
          const fill = (first === second) ? '$true' : '$false';
          // slice it inside
          e = eva.slice(0, i - (length1 + 1))
            .concat(fill
              .concat(eva.slice(i + length2 + 4, eva.length)));
        } else {
          console.error(`Expected $true or $false in ${eva} at Column ${i + 1}`);
        }
      }
      i += 1;
    }
    if (e !== eva) {
      return this.evalIff(e);
    }
    return e;
  },

  evalImplies(eva) {
    let e = eva;
    // find <- / ->
    let i = 0;
    while (i < eva.length - 2 && e === eva) {
      if (eva.charAt(i) === '-') {
        if (eva.charAt(i + 1) === '>') {
          // preceeding implies following value
          const [first, length1] = this.getString(eva, i - 1, true);
          const [second, length2] = this.getString(eva, i + 3);
          const fill = (first === 'false' || (first === 'true' && second === 'true')) ? '$true' : '$false';
          // slice it inside
          e = eva.slice(0, i - (length1 + 1))
            .concat(fill
              .concat(eva.slice(i + length2 + 3, eva.length)));
        } else if (eva.charAt(i - 1) === '<') {
          // following implies preceeding value
          const [first, length1] = this.getString(eva, i - 2, true);
          const [second, length2] = this.getString(eva, i + 2);
          const fill = (second === 'false' || (first === 'true' && second === 'true')) ? '$true' : '$false';
          // slice it inside
          e = eva.slice(0, i - (length1 + 2))
            .concat(fill
              .concat(eva.slice(i + length2 + 2, eva.length)));
        } else {
          console.error(`Expected > or < in ${eva} next to Column ${i + 1}`);
        }
      }
      i += 1;
    }
    if (e !== eva) {
      return this.evalImplies(e);
    }
    return e;
  },
};
