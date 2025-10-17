import { ICellRendererParams } from 'ag-grid-community';

import { TableCellStructure } from '@/share/InterfaceTypesTable';
import { convertToYYYYMMDD } from './convertToYYYYMMDD';

export function hasValueGetter(
  params: ICellRendererParams,
  value: TableCellStructure,
) {
  const finalData: string[] = [];
  const data = params?.data;

  const fields = value.cell_val.fields;
  const isDateStr = fields[0]?.var_name.includes('date_str')
  const firstData = data[fields[0]?.var_name];
  const valueCellType = value.cell_type;
  const joinDelimiter: string | undefined = value.cell_val.join;

  if (valueCellType === 'literal') {
    if(isDateStr){
      return firstData ? convertToYYYYMMDD(firstData) : '--';
    }
    return firstData ? firstData : '--';
  } else if (value.colID === 'connections') {
    return data.id;
  } else if (valueCellType === 'literal-concat' && Array.isArray(firstData)) {
    for (let i = 0; i < firstData?.length; i++) {
      const dataResult = [];
      for (let j = 0; j < fields?.length; j++) {
        const fieldName = fields[j].var_name;
        const fieldValue = data[fieldName] ? data[fieldName][i] : '--';
        if (fieldValue !== undefined) {
          dataResult.push(String(fieldValue ?? ''));
        } else {
          dataResult.push(String('-'));
        }
      }
      finalData.push(dataResult.join(joinDelimiter));
    }

    return finalData.length !== 0 ? finalData : '--';
  } else if (valueCellType === 'literal-concat') {
    let dataValue: string = '';
    for (let i = 0; i < fields.length; i++) {
      const fieldName = fields[i].var_name;
      const fieldValue = data[fieldName];
      if (fieldValue !== null) {
        dataValue += fieldValue + joinDelimiter;
      } else {
        dataValue += '';
      }
    }
    const result = dataValue.substring(0, dataValue.length - 1);
    return result.length === 0 ? '--' : result;
  }
}
