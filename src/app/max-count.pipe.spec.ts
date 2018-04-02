import { MaxCountPipe } from './max-count.pipe';

describe('MaxCountPipe', () => {
  it('create an instance', () => {
    const pipe = new MaxCountPipe();
    expect(pipe).toBeTruthy();
  });
});
