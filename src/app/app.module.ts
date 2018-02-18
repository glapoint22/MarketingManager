import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { DataService } from "./data.service";
import { HttpModule } from '@angular/http';
import { ExpandableGridComponent } from './expandable-grid/expandable-grid.component';
import { ShopGridComponent } from './shop-grid/shop-grid.component';
import { ResizableDirective } from './resizable.directive';
import { ShopComponent } from './shop/shop.component';
import { MenuButtonComponent } from './menu-button/menu-button.component';


@NgModule({
  declarations: [
    AppComponent,
    ExpandableGridComponent,
    ShopGridComponent,
    ResizableDirective,
    ShopComponent,
    MenuButtonComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
