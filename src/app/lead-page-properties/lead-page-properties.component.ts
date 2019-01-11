import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'lead-page-properties',
  templateUrl: './lead-page-properties.component.html',
  styleUrls: ['./lead-page-properties.component.scss']
})
export class LeadPagePropertiesComponent implements OnInit {
  public gridItem: any;
  private fileInput = document.createElement('input');

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.fileInput.type = 'file';
    this.fileInput.onchange = (event: any) => {
      if (event.target.files.length > 0) {
        let file: File = event.target.files[0],
          formData: FormData = new FormData();

        formData.append('file', file, file.name);

        this.dataService.post('/api/LeadPages', formData)
          .subscribe((leadMagnet: any) => {
            this.gridItem.documents[0].leadMagnet = leadMagnet;
          });
      }
    }
  }

  onLeadMagnetClick() {
    this.fileInput.click();
  }

  onPageTitleChange(title){
    this.gridItem.documents[0].pageTitle = title;
  }

}
