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
  VOYAGESNODE,
} from '@/share/CONST_DATA';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';

export const GenerateCellTableRenderer = (
  params: ICellRendererParams,
  cellFN: string,
  nodeClass?: string
) => {
  const values = params.value;
  const ID = params.data.id;
  const dispatch = useDispatch();
  const { styleName } = usePageRouter()


  let nodeType: string = '';
  if (checkPagesRouteForVoyages(styleName!)) {
    nodeType = VOYAGESNODE;
  } else if (checkPagesRouteForEnslaved(styleName!)) {
    nodeType = ENSLAVEDNODE;
  } else if (checkPagesRouteForEnslavers(styleName!)) {
    nodeType = ENSLAVERSNODE;
  }


  if (Array.isArray(values)) {
    const maxRowsToShow = 5;
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
      cursor: 'pointer',
    };

    if (values.length <= 0) {
      return (
        <span >
          <div style={{ textAlign: 'center' }}>-XXxX-</div>
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
            >{`${value}\n`}</div>
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
        <div style={{ maxHeight: 155, overflowY: 'auto' }}>
          {renderedValues}
          {remainingRows.length > 0 && (
            <div style={ellipsisStyle}>
              {remainingRows.map((value, index) => (
                <div key={`${index}-${value}`}>{value}</div>
              ))}
            </div>
          )}
        </div>
      );
    }

  } else if (typeof values !== 'object' && cellFN !== 'networks') {
    return (
      <div className="div-value">
        <div
          className="value-cell"
          onClick={() => {
            dispatch(setCardRowID(ID));
            dispatch(setIsModalCard(true));
            dispatch(setNodeClass(nodeType));
          }}
        >
          {values}
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
        <div className="value">-XX-</div>
      </div>
    );
  }
};
