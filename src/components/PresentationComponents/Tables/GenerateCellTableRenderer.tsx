import { ICellRendererParams } from 'ag-grid-community';
import { CSSProperties } from 'react';
import NETWORKICON from '@/assets/networksIcon.png';
import { useDispatch } from 'react-redux';
import {
  setNetWorksID,
  setNetWorksKEY,
  setsetOpenModalNetworks,
} from '@/redux/getPastNetworksGraphDataSlice';
import {
  setCardRowID,
  setIsModalCard,
  setNodeClass,
} from '@/redux/getCardFlatObjectSlice';
import '@/style/table.scss';
import {
  ENSLAVEDNODE,
  ENSLAVERSNODE,
  VOYAGESNODECLASS,
} from '@/share/CONST_DATA';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { cleanUpTexDisplay } from '@/utils/functions/cleanUpTextDisplay';
import { numberWithCommas } from '@/utils/functions/numberWithCommas';

export const GenerateCellTableRenderer = (
  params: ICellRendererParams,
  cellFN: string,
  colID: string,
  numberFormat?: string | null,
  nodeClass?: string
) => {

  const values = params.value;
  const ID = params.data.id;
  const dispatch = useDispatch();
  const { styleName } = usePageRouter()

  let nodeType: string = '';
  if (checkPagesRouteForVoyages(styleName!)) {
    nodeType = VOYAGESNODECLASS;
  } else if (checkPagesRouteForEnslaved(styleName!)) {
    nodeType = ENSLAVEDNODE;
  } else if (checkPagesRouteForEnslavers(styleName!)) {
    nodeType = ENSLAVERSNODE;
  }

  const calculateHeight = (rowCount: number) => {
    const rowHeight = 40; // Adjust this value as needed based on your design
    const maxRowsToShow = 5; // Maximum rows to show before applying overflow
    const maxHeight = rowHeight * maxRowsToShow;
    return rowCount * rowHeight <= maxHeight ? rowCount * rowHeight : maxHeight;
  };
  if (Array.isArray(values)) {
    const maxRowsToShow = 5;
    const rowCount = values.length;
    const calculatedHeight = calculateHeight(rowCount);

    const style: CSSProperties = {
      backgroundColor: '#e5e5e5',
      borderRadius: '8px',
      padding: '0px 10px',
      height: '25px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      margin: '5px 0',
      textAlign: 'left',
      lineHeight: '25px',
      fontSize: '13px',
      cursor: 'pointer',
    };

    if (values.length <= 0) {
      return (
        <span >
          <div style={{ textAlign: 'left' }}>--</div>
        </span>
      )
    } else {
      const renderedValues = values.map((value: string, index: number) => {
        return (
          <span key={`${index}-${value}`}>
            <div
              style={style}
              onClick={() => {
                dispatch(setCardRowID(ID));
                dispatch(setIsModalCard(true));
                dispatch(setNodeClass(nodeType));
              }}
              dangerouslySetInnerHTML={{ __html: value ?? null }}
            >
            </div>
          </span>
        )
      });
      const ellipsisStyle: CSSProperties = {
        ...style,
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        overflow: 'hidden',
      };

      const remainingRows = values.slice(maxRowsToShow);
      return (
        <div style={{ maxHeight: calculatedHeight, overflowY: 'auto' }}>
          {renderedValues}
          {remainingRows.length > 0 && (
            <div style={ellipsisStyle}>
              {remainingRows.map((value, index) => (
                <div key={`${index}-${value}`}>{cleanUpTexDisplay(value)}</div>
              ))}
            </div>
          )}
        </div>
      );
    }

  } else if (typeof values !== 'object' && cellFN !== 'networks') {
    const values = params.value;
    let justifyContent: CSSProperties['justifyContent'] = 'flex-end';
    if ((typeof values === 'number')) {
      justifyContent = 'flex-end';
    }
    else {
      justifyContent = 'flex-start';
    }

    let valueFormat = values;
    if (numberFormat === 'comma') {
      valueFormat = numberWithCommas(values)
    } else if (numberFormat === 'percent') {
      valueFormat = `${values}%`
    }
    return (
      <div className="div-value">
        <div
          className="value-cell"
          style={{ justifyContent: justifyContent }}
          onClick={() => {
            dispatch(setCardRowID(ID));
            dispatch(setIsModalCard(true));
            dispatch(setNodeClass(nodeType));
          }}
        >
          {valueFormat}
        </div>
      </div>
    );
  } else if (cellFN === 'networks' && nodeClass) {
    return (
      <div className="network-icon">
        <img
          alt="network"
          src={NETWORKICON}
          onClick={() => {
            dispatch(setsetOpenModalNetworks(true));
            dispatch(setNetWorksID(ID));
            dispatch(setNetWorksKEY(nodeType || nodeClass));
            dispatch(setCardRowID(ID));
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="div-value">
        <div className="value">--</div>
      </div>
    );
  }
};
