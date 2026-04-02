import { TestBed } from '@angular/core/testing';

import { CategoryManagement } from './category-management';

describe('CategoryManagement', () => {
  let service: CategoryManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
