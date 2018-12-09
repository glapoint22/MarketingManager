import { Component, OnInit, HostListener } from '@angular/core';
import { Vector2 } from '../vector2';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  public hue: number = 0;
  private mouseDown: boolean = false;
  private mousePos: Vector2;
  public huePos: number;
  public colorPos: Vector2 = new Vector2(0, 0);
  private mouseType: string;
  public rgbColor = {r: 255, g: 255, b: 255};
  public hexColor: string = '#ffffff';

  constructor() { }

  ngOnInit() {
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      let delta: Vector2 = new Vector2(event.clientX - this.mousePos.x, event.clientY - this.mousePos.y);
      this.mousePos = new Vector2(event.clientX, event.clientY);

      if (this.mouseType === 'hue') {
        this.huePos += delta.y;
        this.huePos = Math.min(255, Math.max(0, this.huePos));
        this.calculateHue();
        
      } else {
        this.colorPos.x += delta.x;
        this.colorPos.y += delta.y;
        this.colorPos.x = Math.min(255, Math.max(0, this.colorPos.x));
        this.colorPos.y = Math.min(255, Math.max(0, this.colorPos.y));
      }
      this.rgbColor = this.getRGB();
      this.hexColor = this.rgbToHex(this.rgbColor);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    this.mouseDown = false;
  }

  onMouseDown(event, type) {
    event.preventDefault();
    this.mouseDown = true;
    this.mouseType = type;
    this.mousePos = new Vector2(event.clientX, event.clientY);


    if (this.mouseType === 'hue') {
      if (event.path[0].className !== 'arrow-right' && event.path[0].className !== 'arrow-left') {
        this.huePos = event.offsetY;
      }
      this.calculateHue();
    } else {
      if (event.path[0].className === 'circle') {
        this.colorPos = new Vector2(this.colorPos.x + event.offsetX - 4, this.colorPos.y + event.offsetY - 4);
      } else {
        this.colorPos = new Vector2(event.offsetX, event.offsetY);
      }
    }
    this.rgbColor = this.getRGB();
    this.hexColor = this.rgbToHex(this.rgbColor);

  }

  getRGB() {
    let hsbColor = this.getHsb(),
      hslColor = this.hsbToHsl(hsbColor.h, hsbColor.s, hsbColor.b),
      rgbColor = this.hslToRgb(hslColor.h, hslColor.s, hslColor.l);

    return rgbColor;
  }

  calculateHue() {
    this.hue = (this.huePos / 255) * 360;
  }

  getHsb() {
    return {
      h: this.hue,
      s: (this.colorPos.x / 255) * 100,
      b: (1 - (this.colorPos.y / 255)) * 100
    }
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
    return "#" + this.componentToHex(parseInt(color.r)) + this.componentToHex(parseInt(color.g)) + this.componentToHex(parseInt(color.b));
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

  setColor(){
    let color = this.rgbToHsb(this.rgbColor);
    this.huePos = (color.h / 360) * 255;
    this.calculateHue();
    this.colorPos.x = (color.s / 100) * 255;
    this.colorPos.y = (1-(color.b / 100)) * 255;
    this.hexColor = this.rgbToHex(this.rgbColor);
  }
  
}
