import { VoyageTableCellStructure } from '@/share/InterfaceTypesTable';
import { hasValueGetter } from '@/utils/functions/hasValueGetter';
import { expect, test, describe } from 'vitest';

describe('hasValueGetter', () => {
  const params: any = {
    value: null,
    valueFormatted: null,
    data: {
      field1: 'Value 1',
      field2: null,
      field3: ['Value 3.1', 'Value 3.2'],
      field4: {
        subfield1: 'Value 4.1',
        subfield2: 'Value 4.2',
        subfield3: null,
      },
    },
    rowIndex: 0,
  };

  const value: VoyageTableCellStructure = {
    header_label: 'Test Column',
    cell_type: 'literal',
    visible: true,
    order_by: ['field1'],
    colID: 'field1',
    cell_val: {
      fields: [
        {
          var_name: 'field1',
          cell_fn: 'literal',
        },
      ],
    },
  };

  test('should return the value from data[fields[0].var_name] if cell_type is "literal"', () => {
    // Act
    const result = hasValueGetter(params, value);

    // Assert
    expect(result).toBe('Value 1');
  });

  test('should return "--" if data[fields[0].var_name] is null and cell_type is "literal"', () => {
    // Arrange
    params.data.field1 = null;

    // Act
    const result = hasValueGetter(params, value);

    // Assert
    expect(result).toBe('--');
  });

  test('should return the joined string if cell_type is "literal-concat" and firstData is an array', () => {
    // Arrange
    value.cell_type = 'literal-concat';
    value.cell_val.fields = [
      {
        var_name: 'field3',
        cell_fn: 'literal',
      },
    ];

    // Act
    const result = hasValueGetter(params, value);
    const data = result[0] + ',' + result[1];
    // Assert
    expect(data).toBe('Value 3.1,Value 3.2');
  });

  test('should return "--" if cell_type is "literal-concat" and firstData is an empty array', () => {
    // Arrange
    params.data.field3 = [];
    value.cell_type = 'literal-concat';
    value.cell_val.fields = [
      {
        var_name: 'field3',
        cell_fn: 'literal',
      },
    ];

    // Act
    const result = hasValueGetter(params, value);

    // Assert
    expect(result).toBe('--');
  });
});
