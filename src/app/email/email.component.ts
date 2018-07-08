import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  public height: number;

  constructor() { }

  ngOnInit() {
    this.setHeight();
  }

  setHeight() {
    this.height = window.innerHeight - 22;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight();
  }

}
