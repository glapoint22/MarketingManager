import { SearchFilterPipe } from './search-filter.pipe';

describe('SearchFilterPipe', () => {
  it('should return items based on search criteria', () => {
    const pipe = new SearchFilterPipe();
    let items = [
      {
        data: [
          { value: 'Orange Bed' }
        ]
      },
      {
        data: [
          { value: 'Red Apple' }
        ]
      },
      {
        data: [
          { value: 'Pair' }
        ]
      }
    ];

    let resutlt = pipe.transform(items, 'ppl ed');
    expect(resutlt).toEqual([{
      data: [
        { value: 'Red Apple' }
      ]
    }]);
  });
});
