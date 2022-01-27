import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatHolderComponent } from './group-chat-holder.component';

describe('GroupChatHolderComponent', () => {
  let component: GroupChatHolderComponent;
  let fixture: ComponentFixture<GroupChatHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
