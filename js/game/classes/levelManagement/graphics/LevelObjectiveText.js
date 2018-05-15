// Implementation of the <objective> tag

// Contents - ttl?, ctl?, title?, content

// Example

// <objective>
//  <title>#Markus's revange#</title>
//  <content>
//   #Kill all the enemies\n#
//   #0xADADFF ($enemieskilled)##/20#
//  </content>
// </objective>

// color for textbox
const BOX_COLOR = 0x8d8a7f;
// color for outline of textbox
const OUTLINE_COLOR = 0x807d72;

class LevelObjectiveText extends LevelObject {
  constructor(node) {
    super();
    this.node = node;
    this.scanNodes();
    this.buildGraphics();
    this.isDone = true;
    return this;
  }

  scanNodes() {
    for (let i = 0; i < this.node.children.length; i += 1) {
      switch (this.node.children[i].nodeName) {
        case 'ttl':
          this.ttl = LevelExpression.eval(this.node.children[i].innerHTML);
          break;
        case 'ctl':
          this.ctl = this.node.children[i].innerHTML;
          break;
        case 'title':
          this.titleHTML = this.node.children[i].innerHTML;
          break;
        case 'content':
          this.contentHTML = this.node.children[i].innerHTML;
          break;
        default:
      }
    }
  }

  buildGraphics() {
    if (this.titleHTML === undefined) {
      console.error(`Expected a title for ${this.node}`);
    }
    if (this.graphics === undefined) {
      this.graphics = new Container();
    } else {
      this.graphics.removeChildren();
    }
    // box behind the text
    this.box = new Graphics();
    this.graphics.addChild(this.box);
    // title text
    this.titleTexts = [];
    let offset = 5;
    LevelText.eval(this.titleHTML).forEach((textsnippet) => {
      const t = new Text(textsnippet.text, {
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: 'bold',
        fill: textsnippet.color,
      });
      this.graphics.addChild(t);
      t.x = offset;
      t.y = 5;
      offset += t.width;
      this.needsUpdates = this.needsUpdates || textsnippet.needsUpdates;
    });
    // contet text
    let textWidth = offset;
    offset = 5;
    let line = 0;
    if (this.contentHTML !== undefined) {
      LevelText.eval(this.contentHTML).forEach((textsnippet) => {
        const t = new Text(textsnippet.text, {
          fontFamily: 'Roboto',
          fontSize: 12,
          fill: textsnippet.color,
        });
        this.graphics.addChild(t);
        t.x = offset;
        t.y = 35 + (t.height * line);
        offset += t.width;
        textWidth = Math.max(textWidth, offset);
        if (textsnippet.newline) {
          line += 1;
          offset = 5;
        }
        this.needsUpdates = this.needsUpdates || textsnippet.needsUpdates;
      });
    }
    // fit the box
    this.box.beginFill(BOX_COLOR);
    this.box.lineStyle(5, OUTLINE_COLOR);
    this.box.drawRect(0, 0, textWidth + 5, (line * 12) + 55);
    this.box.endFill();
    this.box.alpha = 0.5;
    this.graphics.pivot.set(this.box.width, 0);
    this.graphics.position.set(game.WIDTH - 20, 20);
    gametextContainer.addChild(this.graphics);
  }

  update(delta) {
    // update texts if necessary
    if (this.needsUpdates) {
      this.buildGraphics();
    }
    // we might not live forever
    if (this.ctl !== undefined && !LevelEvaluation.eval(this.ctl)) {
      this.kill();
    } else if (this.ttl !== undefined) {
      this.ttl -= delta;
      if (this.ttl <= 0) {
        this.kill();
      }
    }
    return this;
  }

  remove() {
    return !this.isDone;
  }

  unimportant() {
    return this.isDone;
  }

  kill() {
    this.isDone = true;
    gametextContainer.removeChild(this.graphics);
    this.graphics = undefined;
  }
}
