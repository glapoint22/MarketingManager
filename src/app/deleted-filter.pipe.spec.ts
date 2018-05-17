import { DeletedFilterPipe } from './deleted-filter.pipe';

describe('DeletedFilterPipe', () => {
  it('should not show items that are makred deleted', () => {
    const pipe = new DeletedFilterPipe();
    let items = [
      {
        data: [
          {
            value: 'Chair'
          }
        ]
      },
      {
        isDeleted: true,
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
    let result = pipe.transform(items, 1);
    expect(result).toEqual([
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
            value: 'Book'
          }
        ]
      }
    ]);
  });
});