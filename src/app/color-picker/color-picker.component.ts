import { Component, OnInit, HostListener } from '@angular/core';
import { Vector2 } from '../vector2';
import { ColorService } from '../color.service';

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
  public hexColor: string = '#ffffff';


  private _rgbColor: any = { r: 255, g: 255, b: 255 };;
  public get rgbColor(): any {
    return this._rgbColor;
  }
  public set rgbColor(v: any) {
    if (v) {
      v.r = Math.min(255, v.r);
      v.g = Math.min(255, v.g);
      v.b = Math.min(255, v.b);

      if (isNaN(v.r)) v.r = 0;
      if (isNaN(v.g)) v.g = 0;
      if (isNaN(v.b)) v.b = 0;

      this._rgbColor = v;
    }
  }


  constructor(private colorService: ColorService) { }

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
      this.setColor();
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
    this.setColor();

  }

  getRGB() {
    let hsbColor = this.getHsb(),
      hslColor = this.colorService.hsbToHsl(hsbColor.h, hsbColor.s, hsbColor.b),
      rgbColor = this.colorService.hslToRgb(hslColor.h, hslColor.s, hslColor.l);

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

  setColorInput() {
    this.rgbColor = this.rgbColor;
    let color = this.colorService.rgbToHsb(this.rgbColor);
    this.huePos = (color.h / 360) * 255;
    this.calculateHue();
    this.colorPos.x = (color.s / 100) * 255;
    this.colorPos.y = (1 - (color.b / 100)) * 255;
    this.hexColor = this.colorService.rgbToHex(this.rgbColor);
    // this.colorService.colorElement.style.backgroundColor = this.hexColor;
    this.colorService.colorElements.forEach((colorElement: HTMLElement) => {
      colorElement.style[this.colorService.colorType] = this.hexColor;
    });
  }

  setHexInput() {
    this.rgbColor = this.colorService.hexToRgb(this.hexColor);
    this.setColorInput();
  }

  setColor() {
    this.rgbColor = this.getRGB();
    this.hexColor = this.colorService.rgbToHex(this.rgbColor);
    // this.colorService.colorElement.style[this.colorService.colorType] = this.hexColor;
    this.colorService.colorElements.forEach((colorElement: HTMLElement) => {
      colorElement.style[this.colorService.colorType] = this.hexColor;
    });
  }
}