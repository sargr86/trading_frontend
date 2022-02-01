import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatJoinInvitationComponent } from './group-chat-join-invitation.component';

describe('GroupChatJoinInvitationComponent', () => {
  let component: GroupChatJoinInvitationComponent;
  let fixture: ComponentFixture<GroupChatJoinInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatJoinInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatJoinInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
