import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelSubscriptionsComponent } from './channel-subscriptions.component';

describe('ChannelSubscriptionsComponent', () => {
  let component: ChannelSubscriptionsComponent;
  let fixture: ComponentFixture<ChannelSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
