import { Component } from '@angular/core';
import { LinkService } from '../link.service';

@Component({
  selector: 'link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss']
})
export class LinkFormComponent {
  constructor(public linkService: LinkService) { }
}