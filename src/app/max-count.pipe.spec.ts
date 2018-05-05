import { MaxCountPipe } from './max-count.pipe';

xdescribe('MaxCountPipe', () => {
  it('create an instance', () => {
    const pipe = new MaxCountPipe();
    expect(pipe).toBeTruthy();
  });
});
