import { TestBed } from '@angular/core/testing';

import { EnglishScoreService } from './english-score.service';

describe('EnglishScoreService', () => {
  let service: EnglishScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnglishScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
