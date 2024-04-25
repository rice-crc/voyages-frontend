import { RootState } from '@/redux/store';
import { RangeSliderState } from '@/share/InterfaceTypes';
import '@/style/homepage.scss'
import { useSelector } from 'react-redux';

interface ResetAllButtonProps {
    varName: string;
    clusterNodeKeyVariable?: string
    clusterNodeValue?: string;
    handleResetAll: () => void;
}

export const ResetAllButton = (props: ResetAllButtonProps) => {
    const { clusterNodeKeyVariable, clusterNodeValue, handleResetAll } = props;
    const { isChange } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { isChangeGeoTree } = useSelector(
        (state: RootState) => state.getGeoTreeData
    );

    const { isChangeAuto } = useSelector((state: RootState) => state.autoCompleteList);
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const { resetAll } = useSelector((state: RootState) => state.getLanguages);
    return (
        <>
            {(isChange || isChangeGeoTree || isChangeAuto || filtersObj?.length > 0 || (clusterNodeKeyVariable && clusterNodeValue)) && (
                <div className="btn-navbar-reset-all" onClick={handleResetAll}>
                    <i aria-hidden="true" className="fa fa-times"></i>
                    <span>{resetAll}</span>
                </div>
            )}</>
    )
}