// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

// Services
import { DataService } from "./data.service";
import { SaveService } from "./save.service";
import { PromptService } from "./prompt.service";

// Directives
import { ResizableDirective } from './resizable.directive';

// Pipes
import { TierFilterPipe } from './tier-filter.pipe';
import { DataFilterPipe } from './data-filter.pipe';
import { FeaturedFilterPipe } from './featured-filter.pipe';
import { MaxCountPipe } from './max-count.pipe';
import { SearchFilterPipe } from './search-filter.pipe';
import { SortPipe } from './sort.pipe';

// Components
import { AppComponent } from './app.component';
import { ShopGridComponent } from './shop-grid/shop-grid.component';
import { ShopComponent } from './shop/shop.component';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { EmailComponent } from './email/email.component';
import { LeadsComponent } from './leads/leads.component';
import { SocialComponent } from './social/social.component';
import { FilterGridComponent } from './filter-grid/filter-grid.component';
import { EditorComponent } from './editor/editor.component';
import { FeaturedGridComponent } from './featured-grid/featured-grid.component';
import { TierComponent } from './tier/tier.component';
import { GridComponent } from './grid/grid.component';
import { EditableGridComponent } from './editable-grid/editable-grid.component';
import { MediaComponent } from './media/media.component';
import { PromptComponent } from './prompt/prompt.component';
import { DeletedFilterPipe } from './deleted-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ShopGridComponent,
    ResizableDirective,
    ShopComponent,
    MenuButtonComponent,
    EmailComponent,
    LeadsComponent,
    SocialComponent,
    FilterGridComponent,
    EditorComponent,
    FeaturedGridComponent,
    TierComponent,
    TierFilterPipe,
    GridComponent,
    EditableGridComponent,
    DataFilterPipe,
    FeaturedFilterPipe,
    MaxCountPipe,
    SearchFilterPipe,
    MediaComponent,
    SortPipe,
    PromptComponent,
    DeletedFilterPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [DataService, SaveService, PromptService],
  bootstrap: [AppComponent]
})
export class AppModule { }