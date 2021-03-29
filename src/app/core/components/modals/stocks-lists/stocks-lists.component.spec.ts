import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksListsComponent } from './stocks-lists.component';

describe('StocksListsComponent', () => {
  let component: StocksListsComponent;
  let fixture: ComponentFixture<StocksListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
