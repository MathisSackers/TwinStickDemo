// The class that manages all text on display

// color for texts
const TEXT_COLOR = 0xe1ddcf;

// Base class
class GameText {
  constructor() {
    this.numTexts = 1;
    this.texts = [new Text('...')];
    this.textContainer = textContainer;
    this.textContainer.addChild(this.texts[0]);
    return this;
  }

  setText(string, instance = 0, wide = false) {
    if (instance >= this.numTexts) {
      this.setNumTexts(instance + 1);
    }
    this.texts[instance].text = string;
    this.texts[instance].visible = true;
    if (wide) {
      this.texts[instance].style = {
        fontVariant: 'small-caps',
        fontFamily: 'Roboto',
        fontSize: 80,
        fill: TEXT_COLOR,
        letterSpacing: game.WIDTH / 10,
      };
    } else {
      this.texts[instance].style = { fontFamily: 'Roboto', fill: TEXT_COLOR };
    }
    this.centerTexts();
    return this;
  }

  centerTexts() {
    for (let i = 0; i < this.numTexts; i += 1) {
      this.centerText(i);
    }
  }

  centerText(instance = 0) {
    switch (this.numTexts) {
      case 1:
        this.texts[instance].x = (game.WIDTH / 2) - (this.texts[instance].width / 2);
        this.texts[instance].y = game.HEIGHT / 3;
        break;
      case 3:
        if (instance > 0) {
          this.texts[instance].x = ((game.WIDTH / 4) - (this.texts[instance].width / 2));
          if (instance === 2) {
            this.texts[instance].x += (game.WIDTH / 2);
          }
          this.texts[instance].y = game.HEIGHT - (game.HEIGHT / 3);
        } else {
          this.texts[instance].x = (game.WIDTH / 2) - (this.texts[instance].width / 2);
          this.texts[instance].y = game.HEIGHT / 3;
        }
        break;
      default:
        this.texts[instance].x = (game.WIDTH / 4) - (this.texts[instance].width / 2);
        if (instance % 2 === 1) {
          this.texts[instance].x += (game.WIDTH / 2);
        }
        this.texts[instance].y = game.HEIGHT / 3;
        if (this.numTexts === 4 && instance > 1) {
          this.texts[instance].y += game.HEIGHT / 3;
        }
    }
  }

  setNumTexts(numberOfTexts = 1) {
    const n = numberOfTexts < 1 ? 1 : numberOfTexts;
    while (this.numTexts < n) {
      this.numTexts += 1;
      this.texts.push(new Text('...'));
      this.textContainer.addChild(this.texts[this.texts.length - 1]);
    }
    while (this.numTexts > n) {
      this.numTexts -= 1;
      this.textContainer.removeChild(this.texts[this.texts.length - 1]);
      this.texts.pop();
    }
    return this;
  }

  hide() {
    this.textContainer.visible = false;
  }

  show() {
    this.textContainer.visible = true;
  }
}
