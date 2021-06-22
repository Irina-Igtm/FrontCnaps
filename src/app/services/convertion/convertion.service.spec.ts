import { TestBed } from '@angular/core/testing';

import { ConvertionService } from './convertion.service';

describe('ConvertionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConvertionService = TestBed.get(ConvertionService);
    expect(service).toBeTruthy();
  });
});
