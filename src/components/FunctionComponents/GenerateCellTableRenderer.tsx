import { ICellRendererParams } from 'ag-grid-community';
import { CSSProperties } from 'react';
import NETWORKICON from '@/assets/networksIcon.png';
import '@/style/table.scss';
import { useDispatch } from 'react-redux';
import {
  setNetWorksID,
  setNetWorksKEY,
  setsetOpenModalNetworks,
} from '@/redux/getPastNetworksGraphDataSlice';

export const GenerateCellTableRenderer = (
  params: ICellRendererParams,
  colID: string,
  cellFN?: string
) => {
  const values = params.value;
  const dispatch = useDispatch();
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
  } else if (typeof values !== 'object' && colID !== 'connections') {
    return (
      <div className="div-value">
        <div className="value">{values}</div>
      </div>
    );
  } else if (colID === 'connections' && cellFN) {
    const ID = values;
    const KEY = cellFN;
    return (
      <div className="network-icon">
        <img
          alt="network"
          src={NETWORKICON}
          onClick={() => {
            dispatch(setsetOpenModalNetworks(true));
            dispatch(setNetWorksID(ID));
            dispatch(setNetWorksKEY(KEY));
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
