import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { DataService } from "./data.service";
import { HttpModule } from '@angular/http';
import { ExpandableGridComponent } from './expandable-grid/expandable-grid.component';
import { ShopGridComponent } from './shop-grid/shop-grid.component';
import { ResizableDirective } from './resizable.directive';
import { ShopComponent } from './shop/shop.component';


@NgModule({
  declarations: [
    AppComponent,
    ExpandableGridComponent,
    ShopGridComponent,
    ResizableDirective,
    ShopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
