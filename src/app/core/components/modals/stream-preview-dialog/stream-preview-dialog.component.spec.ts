import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamPreviewDialogComponent } from './stream-preview-dialog.component';

describe('StreamPreviewDialogComponent', () => {
  let component: StreamPreviewDialogComponent;
  let fixture: ComponentFixture<StreamPreviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamPreviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
