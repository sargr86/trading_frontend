import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowConnectionsComponent } from './show-connections.component';

describe('ShowConnectionsComponent', () => {
  let component: ShowConnectionsComponent;
  let fixture: ComponentFixture<ShowConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
