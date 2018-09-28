import { TestBed, inject } from '@angular/core/testing';

import { EditBoxService } from './edit-box.service';

describe('EditBoxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditBoxService]
    });
  });

  it('should be created', inject([EditBoxService], (service: EditBoxService) => {
    expect(service).toBeTruthy();
  }));
});
