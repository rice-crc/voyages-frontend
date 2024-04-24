import { RootState } from '@/redux/store';
import { RangeSliderState } from '@/share/InterfaceTypes';
import '@/style/homepage.scss'
import { useSelector } from 'react-redux';

interface ViewAllButtonProps {
    varName: string;
    clusterNodeKeyVariable?: string
    clusterNodeValue?: string;
    handleViewAll?: () => void;
}

export const ViewAllButton = (props: ViewAllButtonProps) => {
    const { isChange } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { isChangeGeoTree } = useSelector(
        (state: RootState) => state.getGeoTreeData
    );
    const { isChangeAuto } = useSelector((state: RootState) => state.autoCompleteList);
    const { clusterNodeKeyVariable, clusterNodeValue, handleViewAll } = props;
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const { viewAll } = useSelector((state: RootState) => state.getLanguages);
    return (
        <>
            {(isChange || isChangeGeoTree || isChangeAuto || filtersObj?.length > 1 || (clusterNodeKeyVariable && clusterNodeValue)) && (
                <div className="btn-navbar-reset-all" onClick={handleViewAll}>
                    <i aria-hidden="true" className="fa fa-filter"></i>
                    <span>{viewAll}</span>
                </div>
            )}</>
    )
}