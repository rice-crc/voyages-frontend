import { usePageRouter } from '@/hooks/usePageRouter';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { allEnslavers } from '@/share/CONST_DATA';
import { LanguagesProps } from '@/share/InterfaceTypeLanguages';
import { RangeSliderState, TYPESOFDATASET, TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import '@/style/homepage.scss'
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface ViewAllButtonProps {
    varName: string;
    clusterNodeKeyVariable?: string
    clusterNodeValue?: string;
    handleViewAll?: () => void;
}

export const ViewAllButton = (props: ViewAllButtonProps) => {
    const dispatch: AppDispatch = useDispatch();
    const { styleName: styleNameRoute } = usePageRouter()
    const { clusterNodeKeyVariable, clusterNodeValue, handleViewAll } = props;
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const { viewAll } = useSelector((state: RootState) => state.getLanguages as LanguagesProps);
    const { isView } = useSelector((state: RootState) => state.getShowFilterObject);
    const storedValue = localStorage.getItem('saveSearchID');

    useEffect(() => {
        if (storedValue) {
            dispatch(setIsViewButtonViewAllResetAll(false))
        } else if ((styleNameRoute === TYPESOFDATASET.allVoyages || styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved || styleNameRoute === allEnslavers) && filtersObj.length > 0) {
            dispatch(setIsViewButtonViewAllResetAll(true))
        } else if (filtersObj.length > 1) {
            dispatch(setIsViewButtonViewAllResetAll(true))
        }
    }, [isView])

    return (
        <>
            {isView || (clusterNodeKeyVariable && clusterNodeValue) ? (
                <div className="btn-navbar-reset-all" onClick={handleViewAll}>
                    <i aria-hidden="true" className="fa fa-filter"></i>
                    <span>{viewAll}</span>
                </div>
            ) : null}</>
    )
}