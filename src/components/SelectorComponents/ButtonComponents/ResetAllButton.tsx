import { usePageRouter } from '@/hooks/usePageRouter';
import { RootState } from '@/redux/store';
import { allEnslavers } from '@/share/CONST_DATA';
import { RangeSliderState, TYPESOFDATASET, TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import '@/style/homepage.scss'
import { useRef } from 'react';
import { useSelector } from 'react-redux';

interface ResetAllButtonProps {
    varName: string;
    clusterNodeKeyVariable?: string
    clusterNodeValue?: string;
    handleResetAll: () => void;
}

export const ResetAllButton = (props: ResetAllButtonProps) => {
    const { clusterNodeKeyVariable, clusterNodeValue, handleResetAll } = props;
    const { styleName: styleNameRoute } = usePageRouter()
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const { resetAll } = useSelector((state: RootState) => state.getLanguages);
    let isView = false
    if ((styleNameRoute === TYPESOFDATASET.allVoyages || styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved || styleNameRoute === allEnslavers) && filtersObj.length > 0) {
        isView = true
    } else if (filtersObj.length > 1) {
        isView = true
    }

    return (
        <>
            {isView || (clusterNodeKeyVariable && clusterNodeValue) ? (
                <div className="btn-navbar-reset-all" onClick={handleResetAll}>
                    <i aria-hidden="true" className="fa fa-times"></i>
                    <span>{resetAll}</span>
                </div>
            ) : null}</>
    )
}