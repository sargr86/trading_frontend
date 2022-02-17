import { TestBed } from '@angular/core/testing';

import { UserMessagesSubjectService } from './user-messages-subject.service';

describe('UserMessagesSubjectService', () => {
  let service: UserMessagesSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMessagesSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
