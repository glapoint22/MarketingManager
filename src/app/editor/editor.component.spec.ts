import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.name = 'My Editor';
    fixture.detectChanges();
  });

  it('should display the name of the editor', () => {
    expect(nativeElement.querySelector('.title').innerHTML).toBe('My Editor');
  });

  it('should collapse when arrow is clicked', () => {
    let editorCheckbox: any = document.getElementById('My Editor Checkbox');
    let editor = nativeElement.querySelector('.editor');
    editorCheckbox.checked = true
    expect(editor.offsetHeight).toEqual(22);
  });
});
