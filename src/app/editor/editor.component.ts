import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @Input() name: string;
  public isChecked: boolean;

  constructor() { }

  ngOnInit() {
  }

}
