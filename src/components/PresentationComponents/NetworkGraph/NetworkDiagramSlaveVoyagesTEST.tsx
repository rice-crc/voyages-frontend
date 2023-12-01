import { NetworkDiagram } from './NetworkDiagram';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPastNetworksGraphApi } from '@/fetch/pastEnslavedFetch/fetchPastNetworksGraph';
import {
  setNetWorksID,
  setNetWorksKEY,
  setPastNetworksData,
} from '@/redux/getPastNetworksGraphDataSlice';
import { Datas, Nodes, Edges } from '@/share/InterfaceTypePastNetworks';
import { setIsModalCard, setNodeClass } from '@/redux/getCardFlatObjectSlice';
import { ENSLAVEMENTNODE } from '@/share/CONST_DATA';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { NetworkDiagramTest } from './NetworkDiagramTest';
import { dataOne, dataSecond } from './data';
import { NetworkDiagramSVG } from './NetworkDiagramSVG';
import {
  select,
  hierarchy,
  forceSimulation,
  forceManyBody,
  pointer, forceLink,
  forceX, forceCenter,
  forceY,
  forceCollide, drag,
  forceRadial, zoomIdentity
} from "d3";

export const NetworkDiagramSlaveVoyagesTEST = ({
  widthPercentage = 80,
  heigthPercentage = 75,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [newUpdateNetWorkData, setNewUpdateNetworkData] = useState<Datas>({ nodes: [], edges: [] })
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

  // const handleNodeDoubleClick = async (nodeId: number, nodeClass: string) => {
  //   try {
  //     const dataSend = {
  //       [nodeClass]: [Number(nodeId)],
  //     };
  //     const response = await dispatch(fetchPastNetworksGraphApi(dataSend)).unwrap();
  //     if (dataSecond) {

  //       const newNodes = response.nodes.filter((newNode: Nodes) => {
  //         return !netWorkData.nodes.some(
  //           (existingNode) => existingNode.uuid === newNode.uuid
  //         );
  //       });

  //       const newEdges = response.edges.filter((newEdge: Edges) => {
  //         return !netWorkData.edges.some(
  //           (existingEdge) =>
  //             existingEdge.source === newEdge.source &&
  //             existingEdge.target === newEdge.target
  //         );
  //       });

  //       const updatedNodes = [...netWorkData.nodes, ...newNodes];
  //       const updatedEdges = [...netWorkData.edges, ...newEdges];

  //       const updatedData = {
  //         ...netWorkData,
  //         nodes: updatedNodes,
  //         edges: updatedEdges,
  //       };
  //       dispatch(setPastNetworksData(updatedData));
  //     }
  //   } catch (error) {
  //     console.error('Error fetching new nodes:', error);
  //   }
  // };

  const handleNodeDoubleClick = async (nodeId: number, nodeClass: string) => {
    try {
      const dataSend = {
        [nodeClass]: [Number(nodeId)],
      };
      const response = await dispatch(fetchPastNetworksGraphApi(dataSend)).unwrap();
      if (response) {
        const newNodes = response.nodes.filter((newNode: Nodes) => {
          return !netWorkData.nodes.some(
            (existingNode) => existingNode.uuid === newNode.uuid
          );
        });

        const newEdges = response.edges.filter((newEdge: Edges) => {
          return !netWorkData.edges.some(
            (existingEdge) =>
              existingEdge.source === newEdge.source &&
              existingEdge.target === newEdge.target
          );
        });

        const updatedNodes = [...netWorkData.nodes, ...newNodes];
        const updatedEdges = [...netWorkData.edges, ...newEdges];

        const updatedData = {
          ...netWorkData,
          nodes: updatedNodes,
          edges: updatedEdges,
        };

        dispatch(setPastNetworksData(updatedData));

      }
    } catch (error) {
      console.error('Error fetching new nodes:', error);
    }
  };



  const handleClickNodeShowCard = async (nodeId: number, nodeClass: string) => {
    if (nodeClass !== ENSLAVEMENTNODE) {
      dispatch(setIsModalCard(true));
      dispatch(setNodeClass(nodeClass));
      dispatch(setNetWorksID(nodeId));
      dispatch(setNetWorksKEY(nodeClass))
    }
  };


  useEffect(() => {
    let subscribed = true;
    const dataSend: { [key: string]: number[] } = {
      [networkKEY]: [Number(networkID)],
    };

    const fetchPastNetworksGraph = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(fetchPastNetworksGraphApi(dataSend)).unwrap();

        if (dataOne && subscribed) {
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
        <div style={{ width: `${width}px`, height: `${height}px` }}>
          {/* <NetworkDiagramTest
            newUpdateNetWorkData={newUpdateNetWorkData}
            netWorkData={netWorkData}
            width={width}
            height={height}
            handleNodeDoubleClick={handleNodeDoubleClick}
            handleClickNodeShowCard={handleClickNodeShowCard}
          /> */}
          <NetworkDiagramSVG
            newUpdateNetWorkData={newUpdateNetWorkData}
            netWorkData={netWorkData}
            width={width}
            height={height}
            handleNodeDoubleClick={handleNodeDoubleClick}
            handleClickNodeShowCard={handleClickNodeShowCard}
          />
        </div>
      )}
    </div>
  );
};
