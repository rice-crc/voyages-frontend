import { ICellRendererParams } from 'ag-grid-community';
import { CSSProperties } from 'react';

export const generateCellTableRenderer =
  () => (params: ICellRendererParams) => {
    const values = params.value;
    if (Array.isArray(values)) {
      const style: CSSProperties = {
        backgroundColor: '#e5e5e5',
        borderRadius: '8px',
        padding: '0px 10px',
        height: '25px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        margin: '5px 0',
        textAlign: 'center',
        lineHeight: '25px',
        fontSize: '13px',
      };
      const renderedValues = values.map((value: string, index: number) => (
        <span key={`${index}-${value}`}>
          <div style={style}>{`${value}\n`}</div>
        </span>
      ));
      return <div>{renderedValues}</div>;
    } else {
      return (
        <div className="div-value">
          <div className="value">{values}</div>
        </div>
      );
    }
  };
