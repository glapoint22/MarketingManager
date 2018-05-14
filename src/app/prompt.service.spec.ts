import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { PromptService } from './prompt.service';

describe('PromptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromptService]
    });
  });

  describe('prompt', () => {
    const buttons = [
      {
        text: 'Yes',
        callback: () => { }
      },
      {
        text: 'No',
        callback: () => { }
      }
    ];
    
    it('should set property show to true', inject([PromptService], (service: PromptService) => {
      service.prompt('MyTitle', 'MyText', buttons);
      expect(service.show).toBeTruthy();
    }));

    it('should set title, text, and buttons properties', inject([PromptService], (service: PromptService) => {
      service.prompt('MyTitle', 'MyText', buttons);
      expect(service.title).toEqual('MyTitle');
      expect(service.text).toEqual('MyText');
      expect(service.buttons).toEqual(buttons);
    }));


    it('should set focus to the default button', fakeAsync(inject([PromptService], (service: PromptService) => {
      let btn = document.createElement('button');
      btn.id = 'default-prompt-button';
      document.body.appendChild(btn);
      service.prompt('MyTitle', 'MyText', buttons);
      tick(1);
      expect(document.activeElement).toEqual(btn);
    })));
  });
});