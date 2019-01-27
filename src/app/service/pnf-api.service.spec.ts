import { TestBed, inject } from '@angular/core/testing';

import { PnfApiService } from './pnf-api.service';

describe('PnfApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PnfApiService]
    });
  });

  it('should be created', inject([PnfApiService], (service: PnfApiService) => {
    expect(service).toBeTruthy();
  }));
});
