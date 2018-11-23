import { TestBed, inject } from '@angular/core/testing';

import { EditBoxManagerService } from './edit-box-manager.service';

describe('EditBoxManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditBoxManagerService]
    });
  });

  it('should be created', inject([EditBoxManagerService], (service: EditBoxManagerService) => {
    expect(service).toBeTruthy();
  }));
});
