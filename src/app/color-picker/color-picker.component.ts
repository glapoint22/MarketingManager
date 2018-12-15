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
  public huePos: number;
  public colorPos: Vector2 = new Vector2(0, 0);
  public hue: number = 0;
  private mouseDown: boolean = false;
  private mousePos: Vector2;
  private mouseDownArea: string;
  private containerPos: Vector2 = new Vector2((window.innerWidth * 0.5) - 203.5, (window.innerHeight * 0.5) - 156.5);

  // rgbColor
  private _rgbColor: any = { r: 255, g: 255, b: 255 };;
  public get rgbColor(): any {
    return this._rgbColor;
  }
  public set rgbColor(color: any) {
    if (color) {
      // Set min & max
      color.r = Math.min(255, Math.max(0, color.r));
      color.g = Math.min(255, Math.max(0, color.g));
      color.b = Math.min(255, Math.max(0, color.b));

      // If not a number then set it as zero
      if (isNaN(color.r)) color.r = 0;
      if (isNaN(color.g)) color.g = 0;
      if (isNaN(color.b)) color.b = 0;

      // Set the new color
      this.colorService.newColor = '#' + this.colorService.rgbToHex(color);
      this.colorService.setElements();

      this._rgbColor = color;
    }
  }

  constructor(public colorService: ColorService) { }

  ngOnInit() {
    this.rgbColor = this.colorService.hexToRgb(this.colorService.currentColor);
    this.setColorPositions();
    this.hue = this.colorService.rgbToHsb(this.rgbColor).h;
    this.setInputs();
  }

  onMouseDown(event, area) {
    event.preventDefault();
    this.mouseDown = true;
    this.mouseDownArea = area;
    this.mousePos = new Vector2(event.clientX, event.clientY);


    if (this.mouseDownArea === 'hue') {
      if (event.path[0].className !== 'arrow-right' && event.path[0].className !== 'arrow-left') {
        this.huePos = event.offsetY;
      }
      this.calculateHue();
    } else if (this.mouseDownArea === 'color') {
      if (event.path[0].className === 'circle') {
        this.colorPos = new Vector2(this.colorPos.x + event.offsetX - 4, this.colorPos.y + event.offsetY - 4);
      } else {
        this.colorPos = new Vector2(event.offsetX, event.offsetY);
      }
    } else if (this.mouseDownArea === 'move') {
      this.containerPos = new Vector2(event.clientX - event.offsetX - 11, event.clientY - event.offsetY - 6);
    }

    this.rgbColor = this.getRGBColor();
    this.setInputs();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      let delta: Vector2 = new Vector2(event.clientX - this.mousePos.x, event.clientY - this.mousePos.y);
      this.mousePos = new Vector2(event.clientX, event.clientY);

      if (this.mouseDownArea === 'move') {
        this.containerPos = new Vector2(Math.min(window.innerWidth - 407, Math.max(0, this.containerPos.x + delta.x)), Math.min(window.innerHeight - 313, Math.max(0, this.containerPos.y + delta.y)));
        return;
      }

      if (this.mouseDownArea === 'hue') {
        this.huePos = Math.min(256, Math.max(0, this.huePos + delta.y));
        this.calculateHue();
      } else if (this.mouseDownArea === 'color') {
        this.colorPos = new Vector2(Math.min(256, Math.max(0, this.colorPos.x + delta.x)), Math.min(256, Math.max(0, this.colorPos.y + delta.y)));
      }
      this.rgbColor = this.getRGBColor();
      this.setInputs();
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    this.mouseDown = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.code === 'Escape') {
      this.colorService.cancelColor();
    } else if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      this.colorService.setColor();
    }
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

  setColorPositions() {
    let hsb = this.colorService.rgbToHsb(this.rgbColor);
    this.huePos = Math.round((hsb.h / 360) * 256);
    this.colorPos.x = Math.round((hsb.s / 100) * 256);
    this.colorPos.y = Math.round((1 - (hsb.b / 100)) * 256);
  }

  setInputs() {
    this.setRGBInputs();
    this.hexInput.nativeElement.value = this.colorService.rgbToHex(this.rgbColor);
  }

  setRGBInputs() {
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
    this.setColorPositions();
    this.calculateHue();
  }

  setHexInput(value) {
    this.rgbColor = this.colorService.hexToRgb(value);
    this.setRGBInputs();
    this.setColorPositions();
    this.calculateHue();
  }
}