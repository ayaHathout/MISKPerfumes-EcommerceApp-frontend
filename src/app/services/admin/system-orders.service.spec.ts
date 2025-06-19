import { TestBed } from '@angular/core/testing';

import { SystemOrdersService } from './system-orders.service';

describe('SystemOrdersService', () => {
  let service: SystemOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
