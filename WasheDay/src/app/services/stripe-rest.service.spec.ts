import { TestBed } from '@angular/core/testing';

import { StripeRestService } from './stripe-rest.service';

describe('StripeRestService', () => {
  let service: StripeRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
