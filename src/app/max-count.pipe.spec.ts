import { MaxCountPipe } from './max-count.pipe';

describe('MaxCountPipe', () => {
  it('should return a max number of items', () => {
    const pipe = new MaxCountPipe();
    let items = pipe.transform([{ name: 'item1' }, { name: 'item2' }, { name: 'item3' }, { name: 'item4' }], 2);
    expect(items.length).toEqual(2);
  });
});