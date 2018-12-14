import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Vector2 } from '../vector2';
import { ColorService } from '../color.service';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @ViewChild('r') rInput: ElementRef;
  @ViewChild('g') gInput: ElementRef;
  @ViewChild('b') bInput: ElementRef;
  @ViewChild('hex') hexInput: ElementRef;
  public hue: number = 0;
  private mouseDown: boolean = false;
  private mousePos: Vector2;
  public huePos: number;
  public colorPos: Vector2 = new Vector2(0, 0);
  private mouseType: string;


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
      this.colorService.newColor = '#' + this.colorService.rgbToHex(v);
      this.setElements();

      this._rgbColor = v;
    }
  }
  
  constructor(public colorService: ColorService) { }

  ngOnInit() {
    if (!this.colorService.currentColor) {
      this.colorService.newColor = '#ffffff';
      return;
    }
    this.setColorPositions(this.colorService.hexToRgb(this.colorService.currentColor));
    this.calculateHue();
    this.rgbColor = this.getRGBColor();
    this.setInputs();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      let delta: Vector2 = new Vector2(event.clientX - this.mousePos.x, event.clientY - this.mousePos.y);
      this.mousePos = new Vector2(event.clientX, event.clientY);

      if (this.mouseType === 'hue') {
        this.huePos += delta.y;
        this.huePos = Math.min(256, Math.max(0, this.huePos));
        this.calculateHue();

      } else {
        this.colorPos.x += delta.x;
        this.colorPos.y += delta.y;
        this.colorPos.x = Math.min(256, Math.max(0, this.colorPos.x));
        this.colorPos.y = Math.min(256, Math.max(0, this.colorPos.y));
      }
      this.rgbColor = this.getRGBColor();
      this.setInputs();
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
    
    this.rgbColor = this.getRGBColor();
    this.setInputs();
  }

  getRGBColor() {
    let hsbColor = this.getHsb(),
      hslColor = this.colorService.hsbToHsl(hsbColor.h, hsbColor.s, hsbColor.b),
      rgbColor = this.colorService.hslToRgb(hslColor.h, hslColor.s, hslColor.l);

    return rgbColor;
  }

  calculateHue() {
    this.hue = Math.round((this.huePos / 256) * 360);
  }

  getHsb() {
    return {
      h: this.hue,
      s: Math.round((this.colorPos.x / 256) * 100),
      b: Math.round((1 - (this.colorPos.y / 256)) * 100)
    }
  }

  setColorPositions(color) {
    let hsb = this.colorService.rgbToHsb(color);
    this.huePos = Math.round((hsb.h / 360) * 256);
    this.colorPos.x = Math.round((hsb.s / 100) * 256);
    this.colorPos.y = Math.round((1 - (hsb.b / 100)) * 256);
  }

  setInputs() {
    this.setRGBInputs();
    this.hexInput.nativeElement.value = this.colorService.rgbToHex(this.rgbColor);
  }

  setRGBInputs(){
    this.rInput.nativeElement.value = this.rgbColor.r;
    this.gInput.nativeElement.value = this.rgbColor.g;
    this.bInput.nativeElement.value = this.rgbColor.b;
  }

  setRGBInput(component, value) {
    this.rgbColor = {
      r: component === this.rInput.nativeElement ? value : this.rgbColor.r,
      g: component === this.gInput.nativeElement ? value : this.rgbColor.g,
      b: component === this.bInput.nativeElement ? value : this.rgbColor.b
    }
    this.hexInput.nativeElement.value = this.colorService.rgbToHex(this.rgbColor);
    this.setColorPositions(this.rgbColor);
    this.calculateHue();
  }

  setHexInput(value) {
    this.rgbColor = this.colorService.hexToRgb(value);
    this.setRGBInputs();
    this.setColorPositions(this.rgbColor);
    this.calculateHue();
  }

  setElements() {
    this.colorService.colorElements.forEach((colorElement: HTMLElement) => {
      colorElement.style[this.colorService.colorType] = this.colorService.newColor;
    });
  }
}