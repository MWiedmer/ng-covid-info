import { TestBed } from '@angular/core/testing';

import { BagFetcherService } from './bag-fetcher.service';

describe('BagFetcherService', () => {
  let service: BagFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BagFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
