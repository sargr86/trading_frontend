import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCarouselHolderComponent } from './video-carousel-holder.component';

describe('VideoCarouselHolderComponent', () => {
  let component: VideoCarouselHolderComponent;
  let fixture: ComponentFixture<VideoCarouselHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoCarouselHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCarouselHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
