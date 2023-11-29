import { useEffect, useRef, useState } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPastNetworksGraphApi } from '@/fetch/pastEnslavedFetch/fetchPastNetworksGraph';
import { setPastNetworksData, } from '@/redux/getPastNetworksGraphDataSlice';
import { Datas } from '@/share/InterfaceTypePastNetworks';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { useDimensions } from '@/hooks/useDimensions';
import { NetworkDiagramSVGEnterNode } from './NetworkDiagramSVGEnterNode';

export const NetworkDiagramSlaveVoyagesTEST = ({
  widthPercentage = 80,
  heigthPercentage = 75,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const graphRef = useRef(null);
  const graphSize = useDimensions(graphRef);

  const [isLoading, setIsLoading] = useState(false);
  const { data: netWorkData } = useSelector(
    (state: RootState) => state.getPastNetworksGraphData
  );

  const { networkID, networkKEY } = useSelector(
    (state: RootState) => state.getPastNetworksGraphData
  );
  const modalWidth = window.innerWidth;
  const modalHeight = window.innerHeight;
  const width = (modalWidth * widthPercentage) / 100;
  const height = (modalHeight * heigthPercentage) / 100;

  useEffect(() => {
    let subscribed = true;
    const dataSend: { [key: string]: number[] } = {
      [networkKEY]: [Number(networkID)],
    };

    const fetchPastNetworksGraph = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(fetchPastNetworksGraphApi(dataSend)).unwrap();

        if (response && subscribed) {
          setIsLoading(false);
          dispatch(setPastNetworksData(response as Datas));
        }
      } catch (error) {
        setIsLoading(false);
        console.log('error', error);
      }
    };
    fetchPastNetworksGraph();
    return () => {
      subscribed = false;
    };
  }, [dispatch]);

  if (width === 0 || !netWorkData) {
    return null;
  }
  return (
    <div>
      {isLoading ? (
        <div className="loading-logo">
          <img src={LOADINGLOGO} />
        </div>
      ) : (
        <div style={{ width: `${width}px`, height: `${height}px` }} ref={graphRef} >
          {/* <NetworkDiagramSVG
            // newUpdateNetWorkData={newUpdateNetWorkData}
            // netWorkData={netWorkData}
            width={graphSize.width}
            height={graphSize.height}
            handleNodeDoubleClick={handleNodeDoubleClick}
            handleClickNodeShowCard={handleClickNodeShowCard}
          /> */}
          <NetworkDiagramSVGEnterNode
            width={graphSize.width}
            height={graphSize.height}
          />
        </div>
      )}
    </div>
  );
};
