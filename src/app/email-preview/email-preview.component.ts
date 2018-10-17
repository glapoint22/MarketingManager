import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmailPreviewService } from '../email-preview.service';

@Component({
  selector: 'email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss']
})
export class EmailPreviewComponent implements OnInit {
  @ViewChild('content') content: ElementRef;

  constructor(public emailPreviewService: EmailPreviewService) { }

  ngOnInit() {
   
  }
  // ngAfterViewInit(){
  //   this.content.nativeElement.innerHTML = '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0080ff" style="line-height: normal;"><tr><td width="100%"><table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#80ff80" style="max-width: 600px;"><tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top" width="100%"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="22.166666666666668%" height="50"></td><td width="77.83333333333333%" height="50"></td></tr><tr><td width="22.166666666666668%"></td><td width="77.83333333333333%"><table width="38.54389721627409%" cellpadding="0" cellspacing="0" border="0"><tr><td style="text-align: left;"><span style="color: rgb(0, 0, 0); font-size: 16px; font-family: &quot;Times New Roman&quot;, Times, serif;">This is a temporary paragraph. Double click to edit this text.</span></td></tr></table></td></tr></table></td></tr></table></td></tr><tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top" width="100%"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="34.5%" height="68"></td><td width="65.5%" height="68"></td></tr><tr><td width="34.5%"></td><td width="65.5%"><table width="36.6412213740458%" cellpadding="0" cellspacing="0" border="0" bgcolor="#b0b0b0"><tr><td align="center"><a href="undefined" style="text-decoration: none;"><table cellpadding="0" cellspacing="0" border="0"><td height="42" align="center"><span style="color: rgb(255, 255, 255); font-size: 16px; font-family: &quot;Times New Roman&quot;, Times, serif;">Button</span></td></table></a></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table>';
  // }

}
