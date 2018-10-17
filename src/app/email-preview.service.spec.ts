import { TestBed, inject } from '@angular/core/testing';

import { EmailPreviewService } from './email-preview.service';

describe('EmailPreviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailPreviewService]
    });
  });

  it('should be created', inject([EmailPreviewService], (service: EmailPreviewService) => {
    expect(service).toBeTruthy();
  }));
});
