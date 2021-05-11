import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksListSampleComponent } from './stocks-list-sample.component';

describe('StocksListSampleComponent', () => {
  let component: StocksListSampleComponent;
  let fixture: ComponentFixture<StocksListSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksListSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksListSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
