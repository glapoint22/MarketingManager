import { TierFilterPipe } from './tier-filter.pipe';

describe('TierFilterPipe', () => {
  it('should only show items that have the passed in parent ID', () => {
    const pipe = new TierFilterPipe();

    let items = [
      {
        parentId: 1,
        data: [
          {
            value: 'Chair'
          }
        ]
      },
      {
        parentId: 2,
        data: [
          {
            value: 'Apple'
          }
        ]
      },
      {
        parentId: 1,
        data: [
          {
            value: 'Book'
          }
        ]
      },
      {
        parentId: 2,
        data: [
          {
            value: 'Orange'
          }
        ]
      }
    ];
    let result = pipe.transform(items, 2);
    expect(result).toEqual([
      {
        parentId: 2,
        data: [
          {
            value: 'Apple'
          }
        ]
      },
      {
        parentId: 2,
        data: [
          {
            value: 'Orange'
          }
        ]
      }
    ]);
  });
});