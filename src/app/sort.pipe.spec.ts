import { SortPipe } from './sort.pipe';

describe('SortPipe', () => {
  it('should sort the items in ascending order', () => {
    const pipe = new SortPipe();
    let items = [
      {
        data: [
          {
            value: 'Chair'
          }
        ]
      },
      {
        data: [
          {
            value: 'Apple'
          }
        ]
      },
      {
        data: [
          {
            value: 'Book'
          }
        ]
      }
    ];

    let result = pipe.transform(items);
    let sortedItems =  [
      {
        data: [
          {
            value: 'Apple'
          }
        ]
      },
      {
        data: [
          {
            value: 'Book'
          }
        ]
      },
      {
        data: [
          {
            value: 'Chair'
          }
        ]
      }
    ];
    expect(result).toEqual(sortedItems);
  });
});