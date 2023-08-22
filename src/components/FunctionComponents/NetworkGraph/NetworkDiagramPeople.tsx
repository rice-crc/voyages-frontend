import { NetworkDiagram } from './NetworkDiagram';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPastNetworksGraphApi } from '@/fetchAPI/pastEnslavedApi/fetchPastNetworksGraph';
import { setPastNetworksData } from '@/redux/getPastNetworksGraphDataSlice';
import { Nodes } from '@/share/InterfaceTypePastNetworks';

export const NetworkDiagramPeople = ({ width = 800, height = 600 }) => {
  const dispatch: AppDispatch = useDispatch();
  const { data } = useSelector(
    (state: RootState) => state.getPastNetworksGraphData
  );

  const { networkID, networkKEY } = useSelector(
    (state: RootState) => state.getPastNetworksGraphData
  );
  const handleNodeDoubleClick = async (nodeId: number, nodeClass: string) => {
    try {
      const formData: FormData = new FormData();
      formData.append(nodeClass, String(nodeId));

      const response = await dispatch(
        fetchPastNetworksGraphApi(formData)
      ).unwrap();
      if (response) {
        const newNodes = response.nodes.filter((newNode: Nodes) => {
          return !data.nodes.some(
            (existingNode: Nodes) => existingNode.uuid === newNode.uuid
          );
        });
        const newData = {
          ...data,
          nodes: [...data.nodes, ...newNodes],
          edges: [...data.edges, ...response.edges],
        };
        dispatch(setPastNetworksData(newData));
      }
    } catch (error) {
      console.error('Error fetching new nodes:', error);
    }
  };

  useEffect(() => {
    let subscribed = true;
    const formData: FormData = new FormData();
    formData.append(networkKEY, String(networkID));
    const fetchPastNetworksGraph = async () => {
      try {
        const response = await dispatch(
          fetchPastNetworksGraphApi(formData)
        ).unwrap();
        if (response && subscribed) {
          dispatch(setPastNetworksData(response));
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchPastNetworksGraph();
    return () => {
      subscribed = false;
    };
  }, [dispatch]);
  if (width === 0 || !data) {
    return null;
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%',
      }}
    >
      <NetworkDiagram
        data={data}
        width={width}
        height={height}
        handleNodeDoubleClick={handleNodeDoubleClick}
      />
    </div>
  );
};
