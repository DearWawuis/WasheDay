import { TestBed } from '@angular/core/testing';

import { ProfileWasherService } from './profile-washer.service';

describe('ProfileWasherService', () => {
  let service: ProfileWasherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileWasherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
