import { FeaturedFilterPipe } from './featured-filter.pipe';

xdescribe('FeaturedFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new FeaturedFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
