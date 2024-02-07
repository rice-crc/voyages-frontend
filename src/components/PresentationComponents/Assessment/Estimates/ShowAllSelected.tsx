import '@/style/estimates.scss'
import { FunctionComponent, useEffect } from 'react';
interface ShowAllSelectedProps {
    setViewAll: React.Dispatch<React.SetStateAction<boolean>>
    ariaExpanded: boolean;
}
const ShowAllSelected: FunctionComponent<ShowAllSelectedProps> = ({ setViewAll, ariaExpanded }) => {
    return (

        <div id="panelCollapse" className="panel-list" v-if="hasCurrentQuery">
            <div className="panel-list-item-wrapper">
                <div className="row-selected">
                    <div className="col-selected">Selected National Carriers</div>
                    <div className='col-selected-all'>all</div>
                </div>
                <div className="row-selected">
                    <div className="col-selected">Selected Embarkation Regions</div>
                    <div className='col-selected-all'>all</div>
                </div>
                <div className="row-selected">
                    <div className="col-selected">Selected Disembarkation Regions</div>
                    <div className='col-selected-all'>all</div>
                </div>
            </div>
            <a
                data-toggle="collapse"
                href="#panelCollapse"
                role="button"
                aria-expanded={ariaExpanded}
                aria-controls="panelCollapse"
            >
                <div className="btn-panel" onClick={() => setViewAll(false)}>
                    <i className="fa fa-times-circle" aria-hidden="true"></i> Hide
                </div>
            </a>
        </div>
    );
}

export default ShowAllSelected;
