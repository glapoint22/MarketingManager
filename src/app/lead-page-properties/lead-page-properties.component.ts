import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { SaveService } from '../save.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lead-page-properties',
  templateUrl: './lead-page-properties.component.html',
  styleUrls: ['./lead-page-properties.component.scss']
})
export class LeadPagePropertiesComponent implements OnInit {
  @Input() grid;
  // public gridItem: any;
  private fileInput = document.createElement('input');

  constructor(private dataService: DataService, private saveService: SaveService) { }

  ngOnInit() {
    this.fileInput.type = 'file';
    this.fileInput.onchange = (event: any) => {
      if (event.target.files.length > 0) {
        let file: File = event.target.files[0],
          formData: FormData = new FormData();

        formData.append('file', file, file.name);

        let validateTokenSubscription: Subscription = this.dataService.validateToken().subscribe(() => {
          validateTokenSubscription.unsubscribe();
          this.dataService.post('/api/LeadPages', formData)
            .subscribe((leadMagnet: any) => {
              this.grid.saveUpdate(this.grid.currentItem, this.grid.tiers[this.grid.currentItem.tierIndex]);
              this.grid.currentItem.documents[0].leadMagnet = leadMagnet;
              this.saveService.checkForNoChanges();
            });
        });
      }
    }
  }

  onLeadMagnetClick() {
    this.fileInput.click();
  }

  onPageTitleChange(event) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      this.grid.saveUpdate(this.grid.currentItem, this.grid.tiers[this.grid.currentItem.tierIndex]);
      this.grid.currentItem.documents[0].pageTitle = event.target.value;
      event.target.blur();
      this.saveService.checkForNoChanges();
    }
  }

  onPageTitleBlur(event) {
    this.grid.saveUpdate(this.grid.currentItem, this.grid.tiers[this.grid.currentItem.tierIndex]);
    this.grid.currentItem.documents[0].pageTitle = event.target.value;
    this.saveService.checkForNoChanges();
  }

  onPageTitleFocus() {
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected) {
      EditBoxComponent.currentEditBox.unSelect();
    }
  }

}
