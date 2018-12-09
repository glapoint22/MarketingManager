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
  public newColor: string = "#ffffff";
  public rgb: Array<number> = [255, 255, 255];

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
      this.calculateNewColor();
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
    this.calculateNewColor();
  }

  calculateNewColor() {
    let x = (this.colorPos.x / 255) * 100,
      y = (1 - (this.colorPos.y / 255)) * 100,
      l = (2 - x / 100) * y / 2,
      s = x * y / (l < 50 ? l * 2 : 200 - l * 2);

    if (isNaN(s)) s = 0;
    this.rgb = this.hslToRgb(this.hue / 360, s / 100, l / 100);
    this.newColor = this.rgbToHex(this.rgb);
  }

  calculateHue() {
    let percent = this.huePos / 255;
    this.hue = percent * 360;
  }

  hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  rgbToHex(colorArray) {
    return "#" + this.componentToHex(parseInt(colorArray[0])) + this.componentToHex(parseInt(colorArray[1])) + this.componentToHex(parseInt(colorArray[2]));
  }

  componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

}
