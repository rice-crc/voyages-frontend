import { usePageRouter } from '@/hooks/usePageRouter';
import { ESTIMATES } from '@/share/CONST_DATA';
import '@/style/map.scss';

const ShowsColoredNodeOnMap = () => {
  const { styleName } = usePageRouter();

  return (
    <div className="leaflet-bottom leaflet-left __web-inspector-hide-shortcut__">
      <div className="legend leaflet-control">
        <table className="legendtable">
          <tbody>
            {styleName !== ESTIMATES && (
              <tr>
                <td>
                  <div className="circle origins"></div>
                </td>
                <td> </td>
                <td>
                  Origins
                  <span
                    id="origins_map_key_pill"
                    data-toggle="tooltip"
                    className="badge badge-pill badge-secondary tooltip-pointer"
                    title=""
                    data-original-title="Origins are derived from user contributions."
                  >
                    (IMP)
                  </span>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <div className="circle embarkations"></div>
              </td>
              <td> </td>
              <td>Embarkations</td>
            </tr>
            {styleName !== ESTIMATES && (
              <tr>
                <td>
                  <div className="circle embark-disembark"></div>
                </td>
                <td> </td>
                <td>Embark &amp; Disembark</td>
              </tr>
            )}
            <tr>
              <td>
                <div className="circle disembarkations"></div>
              </td>
              <td> </td>
              <td>Disembarkations</td>
            </tr>
            {styleName !== ESTIMATES && (
              <tr>
                <td>
                  <div className="circle  post-disembark-location"></div>
                </td>
                <td> </td>
                <td>Post-Disembark Locations</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ShowsColoredNodeOnMap;
