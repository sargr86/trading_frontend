import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectMongoChatComponent } from './direct-mongo-chat.component';

describe('DirectMongoChatComponent', () => {
  let component: DirectMongoChatComponent;
  let fixture: ComponentFixture<DirectMongoChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectMongoChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectMongoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
