import { TestBed } from '@angular/core/testing';

import { Ij2ServiceService } from './ij2-service.service';

describe('Ij2ServiceService', () => {
  let service: Ij2ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ij2ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
