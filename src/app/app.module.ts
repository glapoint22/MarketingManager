import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';

import { DataService } from "./data.service";
import { HttpModule } from '@angular/http';
import { ExpandableGridComponent } from './expandable-grid/expandable-grid.component';
import { ShopGridComponent } from './shop-grid/shop-grid.component';
import { ResizableDirective } from './resizable.directive';
import { ShopComponent } from './shop/shop.component';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { EmailComponent } from './email/email.component';
import { LeadsComponent } from './leads/leads.component';
import { SocialComponent } from './social/social.component';


@NgModule({
  declarations: [
    AppComponent,
    ExpandableGridComponent,
    ShopGridComponent,
    ResizableDirective,
    ShopComponent,
    MenuButtonComponent,
    EmailComponent,
    LeadsComponent,
    SocialComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
