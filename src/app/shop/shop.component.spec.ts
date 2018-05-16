import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { Component, Input, Pipe } from '@angular/core';
import { ShopGridComponent } from '../shop-grid/shop-grid.component';

// editor
@Component({
  selector: 'editor',
  template: ''
})
class MockEditor {
  @Input() name: string;
}

// media
@Component({
  selector: 'media',
  template: ''
})
class MockMedia {
  @Input() shopGrid: ShopGridComponent;
}

// filter-grid
@Component({
  selector: 'filter-grid',
  template: ''
})
class MockFilterGrid {
  public tiers = [];
}

// featured-grid
@Component({
  selector: 'featured-grid',
  template: ''
})
class MockFeaturedGrid {
  @Input() categories;
  @Input() products;
  public showNonFeaturedList;
}

// maxCount
@Pipe({
  name: 'maxCount'
})
class MockMaxCount { }

// searchFilter
@Pipe({
  name: 'searchFilter'
})
class MockSearchFilter { }

// featuredFilter
@Pipe({
  name: 'featuredFilter'
})
class MockFeaturedFilter { }

// shop-grid
@Component({
  selector: 'shop-grid',
  template: ''
})
class MockShopGrid {
  @Input() filterGrid;
  public tiers = [];
}

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;
  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShopComponent,
        MockEditor,
        MockMedia,
        MockFilterGrid,
        MockFeaturedGrid,
        MockMaxCount,
        MockSearchFilter,
        MockFeaturedFilter,
        MockShopGrid
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should display the media editor', () => {
    let editors: Array<any> = Array.from(nativeElement.querySelectorAll('editor'));
    expect(editors.some(x => x.attributes[1].nodeValue === 'Media Editor')).toBeTruthy();
  });

  it('should display the Filter Editor', () => {
    let editors: Array<any> = Array.from(nativeElement.querySelectorAll('editor'));
    expect(editors.some(x => x.attributes[1].nodeValue === 'Filter Editor')).toBeTruthy();
  });

  it('should display the Featured Editor', () => {
    let editors: Array<any> = Array.from(nativeElement.querySelectorAll('editor'));
    expect(editors.some(x => x.attributes[1].nodeValue === 'Featured Editor')).toBeTruthy();
  });

  it('should display the shop grid', () => {
    expect(nativeElement.querySelector('shop-grid')).toBeTruthy();
  });
});