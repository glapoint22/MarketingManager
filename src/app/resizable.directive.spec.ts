import { ResizableDirective } from './resizable.directive';

xdescribe('ResizableDirective', () => {
  it('should create an instance', () => {
    const directive = new ResizableDirective(null);
    expect(directive).toBeTruthy();
  });
});
