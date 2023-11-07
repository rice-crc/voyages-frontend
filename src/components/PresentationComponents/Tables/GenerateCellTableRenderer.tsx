import { ICellRendererParams } from 'ag-grid-community';
import { CSSProperties } from 'react';
import NETWORKICON from '@/assets/networksIcon.png';
import { useDispatch, useSelector } from 'react-redux';
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
import { RootState } from '@/redux/store';
import '@/style/table.scss';
import {
  AFRICANORIGINS,
  ALLENSLAVED,
  ALLENSLAVERS,
  ALLVOYAGES,
  ENSALVERSTYLE,
  ENSLAVEDNODE,
  ENSLAVEDTEXAS,
  ENSLAVERSNODE,
  VOYAGESNODE,
} from '@/share/CONST_DATA';
import { usePageRouter } from '@/hooks/usePageRouter';
import { TYPESOFDATASET } from '@/share/InterfaceTypes';

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
  if (styleName === TYPESOFDATASET.allVoyages || styleName === TYPESOFDATASET.intraAmerican || styleName === TYPESOFDATASET.transatlantic || styleName === TYPESOFDATASET.texas) {
    nodeType = VOYAGESNODE;
  } else if (styleName === ALLENSLAVED || styleName === AFRICANORIGINS || styleName === ENSLAVEDTEXAS) {
    nodeType = ENSLAVEDNODE;
  } else if (styleName === ENSALVERSTYLE) {
    nodeType = ENSLAVERSNODE;
  }


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
      cursor: 'pointer',
    };

    const renderedValues = values.map((value: string, index: number) => (
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
    ));
    return <div>{renderedValues}</div>;
  } else if (typeof values !== 'object' && cellFN !== 'networks') {
    return (
      <div className="div-value">
        <div
          className="value"
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
        <div className="value">--</div>
      </div>
    );
  }
};
