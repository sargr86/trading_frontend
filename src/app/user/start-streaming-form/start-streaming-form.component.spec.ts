import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartStreamingFormComponent } from './start-streaming-form.component';

describe('StartStreamingFormComponent', () => {
  let component: StartStreamingFormComponent;
  let fixture: ComponentFixture<StartStreamingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartStreamingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartStreamingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
