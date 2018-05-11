import { FeaturedFilterPipe } from './featured-filter.pipe';

describe('FeaturedFilterPipe', () => {
  const pipe = new FeaturedFilterPipe();
  let items: Array<any>;
  beforeEach(() => {
    items = [
      {
        name: 'item1',
        featured: true
      },
      {
        name: 'item2',
        featured: false
      },
      {
        name: 'item3',
        featured: true
      },
      {
        name: 'item4',
        featured: false
      }
    ];
  });

  it('should return featured items', () => {
    let featuredItems = pipe.transform(items, true, false);
    expect(featuredItems).toEqual([
      {
        name: 'item1',
        featured: true
      },
      {
        name: 'item3',
        featured: true
      }
    ]);
  });

  it('should return non-featured items', () => {
    let nonFeaturedItems = pipe.transform(items, true, true);
    expect(nonFeaturedItems).toEqual([
      {
        name: 'item2',
        featured: false
      },
      {
        name: 'item4',
        featured: false
      }
    ]);
  });
});