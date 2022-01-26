import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMongoChatComponent } from './group-mongo-chat.component';

describe('GroupMongoChatComponent', () => {
  let component: GroupMongoChatComponent;
  let fixture: ComponentFixture<GroupMongoChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMongoChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMongoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
