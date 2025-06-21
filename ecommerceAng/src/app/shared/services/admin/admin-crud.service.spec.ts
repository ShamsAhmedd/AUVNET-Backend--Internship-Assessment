import { TestBed } from '@angular/core/testing';

import { AdminCrudService } from './admin-crud.service';

describe('AdminCrudService', () => {
  let service: AdminCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
