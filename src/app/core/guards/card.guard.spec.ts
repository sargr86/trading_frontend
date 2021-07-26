import { TestBed } from '@angular/core/testing';

import { CardGuard } from './card.guard';

describe('CardGuard', () => {
  let guard: CardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
