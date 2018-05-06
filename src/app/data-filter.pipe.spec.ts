import { DataFilterPipe } from './data-filter.pipe';

describe('DataFilterPipe', () => {
  it('should only return data that has a corresponding field', () => {
    let pipe = new DataFilterPipe();
    let data = [
      {
        value: 'Name'
      },
      {
        value: 'hopLink'
      },
      {
        value: 'description'
      },
      {
        value: 'price'
      }
    ];

    let fields = [
      {
        name: 'Product',
        defaultValue: 'Product Name',
        width: 1600
      },
      {
        name: 'HopLink',
        defaultValue: 'HopLink URL',
        width: 2560
      }
    ];

    let filteredData = pipe.transform(data, fields);
    expect(filteredData).toEqual([
      {
        value: 'Name'
      },
      {
        value: 'hopLink'
      }
    ]);
  });
});