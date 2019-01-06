import { TestBed, inject } from '@angular/core/testing';

import { DocumentPreviewService } from './document-preview.service';

describe('DocumentPreviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentPreviewService]
    });
  });

  it('should be created', inject([DocumentPreviewService], (service: DocumentPreviewService) => {
    expect(service).toBeTruthy();
  }));
});
