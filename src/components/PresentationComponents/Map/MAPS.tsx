import { MapContainer } from 'react-leaflet';
import { LeafletMap } from './LeafletMap';
import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

function MAPS() {
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const topPosition = createTopPositionVoyages(currentPage, isFilter);

  return (
    <div style={{ paddingTop: currentEnslavedPage === 3 ? 0 : topPosition }}>
      <MapContainer className="map-container">
        <LeafletMap />
      </MapContainer>
    </div>
  );
}

export default MAPS;
