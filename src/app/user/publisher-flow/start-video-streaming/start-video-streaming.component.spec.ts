import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartVideoStreamingComponent } from './start-video-streaming.component';

describe('StartVideoStreamingComponent', () => {
  let component: StartVideoStreamingComponent;
  let fixture: ComponentFixture<StartVideoStreamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartVideoStreamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartVideoStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
