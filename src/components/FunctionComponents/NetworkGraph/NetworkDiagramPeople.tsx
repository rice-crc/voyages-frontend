import { datas } from '@/utils/mockDataGraph';
import { NetworkDiagram } from './NetworkDiagram';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPastNetworksGraphApi } from '@/fetchAPI/pastEnslavedApi/fetchPastNetworksGraph';
import { setPastNetworksData } from '@/redux/getPastNetworksGraphDataSlice';
import GraphDiagramNetwork from './jsGraph/GraphDiagramNetwork.jsx';

export const NetworkDiagramPeople = ({ width = 800, height = 600 }) => {
  const dispatch: AppDispatch = useDispatch();
  const { data } = useSelector(
    (state: RootState) => state.getPastNetworksGraphData
  );

  // Where key and value of each group from ???
  const keyEnslaved = 'enslaved'; // Value === 6
  const keyEnslavers = 'enslavers'; // Value === 1039715
  const keyVoyages = 'voyages'; // Value === 100
  const keyEnslavementRelations = 'enslavement_relations'; // Value === 200

  useEffect(() => {
    let subscribed = true;
    const formData: FormData = new FormData();
    formData.append(keyEnslaved, String(6));
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
    <div style={{ marginTop: '6rem' }}>
      <GraphDiagramNetwork />
      {/* <NetworkDiagram data={datas} width={width} height={height} /> */}
    </div>
  );
};
