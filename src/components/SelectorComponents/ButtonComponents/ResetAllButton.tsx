import { usePageRouter } from '@/hooks/usePageRouter';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { allEnslavers } from '@/share/CONST_DATA';
import { RangeSliderState, TYPESOFDATASET, TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import '@/style/homepage.scss'
import { translationHomepage } from '@/utils/functions/translationLanguages';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface ResetAllButtonProps {
    varName: string;
    clusterNodeKeyVariable?: string
    clusterNodeValue?: string;
    handleResetAll: () => void;
}

export const ResetAllButton = (props: ResetAllButtonProps) => {
    const dispatch: AppDispatch = useDispatch();
    const { clusterNodeKeyVariable, clusterNodeValue, handleResetAll } = props;
    const { styleName: styleNameRoute } = usePageRouter()
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const { isView } = useSelector((state: RootState) => state.getShowFilterObject);
    const { languageValue } = useSelector((state: RootState) => state.getLanguages);
    const translatedHomepage = translationHomepage(languageValue)

    useEffect(() => {
        if ((styleNameRoute === TYPESOFDATASET.allVoyages || styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved || styleNameRoute === allEnslavers) && filtersObj.length > 0) {
            dispatch(setIsViewButtonViewAllResetAll(true))
        } else if (filtersObj.length > 1) {
            dispatch(setIsViewButtonViewAllResetAll(true))
        }
    }, [])

    return (
        <>
            {isView || (clusterNodeKeyVariable && clusterNodeValue) ? (
                <div className="btn-navbar-reset-all" onClick={handleResetAll}>
                    <i aria-hidden="true" className="fa fa-times"></i>
                    <span>{translatedHomepage.resetAll}</span>
                </div>
            ) : null}</>
    )
}