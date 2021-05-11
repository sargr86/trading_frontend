import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksTilesComponent } from './stocks-tiles.component';

describe('StocksTilesComponent', () => {
  let component: StocksTilesComponent;
  let fixture: ComponentFixture<StocksTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
