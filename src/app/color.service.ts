import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  public colorElements: Array<HTMLElement>;
  public showColorPicker: boolean;
  public colorType: string;
  public newColor: string;
  private okCallback: Function;
  private cancelCallback: Function;


  private _currentColor: string;
  public get currentColor(): string {
    return this._currentColor;
  }
  public set currentColor(value: string) {
    if (!value) {
      this.newColor = value = '#ffffff';
    } else if (value.substr(0, 1) === 'r') {
      let colorArray = /(?:rgb\()(\d+)(?:,\s)(\d+)(?:,\s)(\d+)/.exec(value);

      let color = {
        r: parseInt(colorArray[1]),
        g: parseInt(colorArray[2]),
        b: parseInt(colorArray[3])
      }
      value = '#' + this.rgbToHex(color);
    }

    this._currentColor = value;
  }


  hslToRgb(h, s, l) {
    let r, g, b;

    h /= 360;
    s /= 100;
    l /= 100;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = this.hueTorgb(p, q, h + 1 / 3);
      g = this.hueTorgb(p, q, h);
      b = this.hueTorgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }


  hueTorgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }


  rgbToHex(color) {
    return this.componentToHex(parseInt(color.r)) + this.componentToHex(parseInt(color.g)) + this.componentToHex(parseInt(color.b));
  }

  componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  hsbToHsl(h, s, b) {
    // determine the lightness in the range [0,100]
    let l = (2 - s / 100) * b / 2;

    // store the HSL components
    let hsl =
    {
      h: h,
      s: s * b / (l < 50 ? l * 2 : 200 - l * 2),
      l: l
    };

    // correct a division-by-zero error
    if (isNaN(hsl.s)) hsl.s = 0;
    return hsl;
  }

  rgbToHsb(color) {
    var rr, gg, bb,
      red = color.r / 255,
      green = color.g / 255,
      blue = color.b / 255,
      h, s,
      b = Math.max(red, green, blue),
      diff = b - Math.min(red, green, blue),
      diffc = function (c) {
        return (b - c) / 6 / diff + 1 / 2;
      };

    if (diff == 0) {
      h = s = 0;
    } else {
      s = diff / b;
      rr = diffc(red);
      gg = diffc(green);
      bb = diffc(blue);

      if (red === b) {
        h = bb - gg;
      } else if (green === b) {
        h = (1 / 3) + rr - bb;
      } else if (blue === b) {
        h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      b: Math.round(b * 100)
    };
  }

  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  openColorPicker(colorElements: Array<HTMLElement>, colorType: string, currentColor: string, okCallback: Function, cancelCallback: Function) {
    this.showColorPicker = true;
    this.colorElements = colorElements;
    this.colorType = colorType;
    this.currentColor = currentColor;
    this.okCallback = okCallback;
    this.cancelCallback = cancelCallback;
  }

  setColor() {
    this.okCallback();
    this.showColorPicker = false;
  }

  cancelColor() {
    this.showColorPicker = false;
    this.cancelCallback();
  }

  setElements() {
    this.colorElements.forEach((colorElement: HTMLElement) => {
      colorElement.style[this.colorType] = this.newColor;
    });
  }
}