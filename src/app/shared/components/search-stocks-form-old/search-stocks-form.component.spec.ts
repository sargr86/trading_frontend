import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStocksFormOldComponent } from './search-stocks-form-old.component';

describe('SearchStocksFormComponent', () => {
  let component: SearchStocksFormOldComponent;
  let fixture: ComponentFixture<SearchStocksFormOldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchStocksFormOldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchStocksFormOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
