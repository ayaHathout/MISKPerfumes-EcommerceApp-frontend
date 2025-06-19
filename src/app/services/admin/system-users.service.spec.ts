import { TestBed } from '@angular/core/testing';

import { SystemUsersService } from './system-users.service';

describe('SystemUsersService', () => {
  let service: SystemUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
