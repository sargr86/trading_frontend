import { TestBed } from '@angular/core/testing';

import { UserPostsStoreService } from './user-posts-store.service';

describe('UserPostsStoreService', () => {
  let service: UserPostsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPostsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
