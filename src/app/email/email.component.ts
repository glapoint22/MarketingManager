import { Component, OnInit, HostListener, ViewContainerRef, ViewChildren, QueryList } from '@angular/core';
import { EditBoxService } from '../edit-box.service';
import { EditBoxComponent } from '../edit-box/edit-box.component';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  @ViewChildren('emailContentContainer', { read: ViewContainerRef }) emailContentContainer: QueryList<ViewContainerRef>;
  public height: number;
  public emails: Array<any> = [];
  public pageWidth: number = 600;
  private emailContentContainerArray: Array<any>;

  constructor(public editBoxService: EditBoxService) { }

  ngOnInit() {
    this.setHeight();
  }

  ngAfterViewInit() {
    this.emailContentContainer.changes.subscribe((x: QueryList<ViewContainerRef>) => {
      this.emailContentContainerArray = x.toArray();
    });
  }

  setHeight() {
    this.height = window.innerHeight - 22;
  }

  onToggleButtonClick(input, index) {
    if (input.checked) {
      input.checked = false;
      EditBoxComponent.currentContainer = null;
    } else {
      input.checked = true;
      EditBoxComponent.currentContainer = EditBoxComponent.mainContainer = this.emailContentContainerArray[index];
    }
  }

  onItemClick(item) {
    if (item.tierIndex === 0) {
      this.emails = [];
      return;
    }
    this.emails = item.emails
      .map(x => ({
        id: x.id,
        subject: x.subject,
        body: x.body
      }));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight();
  }

  onMouseDown() {
    if (EditBoxComponent.currentEditBox) EditBoxComponent.currentEditBox.unSelect();
  }
}