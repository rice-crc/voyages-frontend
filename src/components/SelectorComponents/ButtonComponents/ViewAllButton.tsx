import { usePageRouter } from '@/hooks/usePageRouter';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { allEnslavers } from '@/share/CONST_DATA';
import { LanguagesProps } from '@/share/InterfaceTypeLanguages';
import { TYPESOFDATASET, TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import '@/style/homepage.scss'
import { translationHomepage } from '@/utils/functions/translationLanguages';
import { useEffect } from 'react';
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
    const { isView } = useSelector((state: RootState) => state.getShowFilterObject);
    const storedValue = localStorage.getItem('saveSearchID');
    const { languageValue } = useSelector((state: RootState) => state.getLanguages);
    const translatedHomepage = translationHomepage(languageValue)

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
                    <span>{translatedHomepage.viewAll}</span>
                </div>
            ) : null}</>
    )
}