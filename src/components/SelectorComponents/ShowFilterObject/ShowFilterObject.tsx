import { usePageRouter } from '@/hooks/usePageRouter';
import { RootState } from '@/redux/store';
import { Filter, RangeSliderState } from '@/share/InterfaceTypes';
import '@/style/estimates.scss'
import { getColorBackgroundHeader } from '@/utils/functions/getColorStyle';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { it } from 'node:test';
import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
interface ShowAllSelectedProps {
    handleViewAll: () => void
    ariaExpanded?: boolean;
}
const ShowFilterObject: FunctionComponent<ShowAllSelectedProps> = ({ handleViewAll }) => {
    const { languageValue } = useSelector((state: RootState) => state.getLanguages);
    const { styleName: styleNameRoute } = usePageRouter()
    const { varName, isChange } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { type: typeData } = useSelector((state: RootState) => state.getFilter);
    const { isChangeGeoTree } = useSelector(
        (state: RootState) => state.getGeoTreeData
    );
    const { isChangeAuto } = useSelector((state: RootState) => state.autoCompleteList);
    const [filterData, setFilterData] = useState<{ label: string; searchTerm: number[] | string[] | CheckboxValueType[] | CheckboxValueType }[]>([]);

    const translated = translationLanguagesEstimatePage(languageValue)
    useEffect(() => {
        const storedValue = localStorage.getItem('filterObject');
        if (!storedValue) return;

        const parsedValue = JSON.parse(storedValue);

        const filter: Filter[] = parsedValue.filter;
        const combinedData: { label: string; searchTerm: number[] | string[] | CheckboxValueType[] | CheckboxValueType }[] = [];
        if (Array.isArray(filter)) {
            filter.forEach((item) => {
                if (item.label) {
                    const searchTermToUse = Array.isArray(item.title) ? item.title.join(', ') : (Array.isArray(item.searchTerm) ? item.searchTerm.join(' - ') : item.searchTerm);
                    combinedData.push({
                        label: item.label!,
                        searchTerm: searchTermToUse
                    });
                } else if (item.varName === 'language_group__name') {
                    const searchTermToUse = (item.searchTerm as string[]).join(' - ')
                    combinedData.push({
                        label: `Language Group`,
                        searchTerm: searchTermToUse
                    });
                }
            });
        }
        setFilterData(combinedData)
    }, [varName, isChange, isChangeGeoTree, isChangeAuto]);


    return (
        <div id="panelCollapse" className="panel-list-view-all" v-if="hasCurrentQuery" style={{ backgroundColor: getColorBackgroundHeader(styleNameRoute!) }}>
            <div className="panel-list-item-wrapper" style={{ display: 'flex' }}>
                {filterData.length > 0 && filterData.map((item, index) => {
                    const { label, searchTerm } = item;
                    return (
                        <span className='view-show-row' key={`${label}-${index}`}>
                            <h4 >{label} : </h4>
                            <div className='value-list'>{searchTerm}</div>
                        </span>
                    )
                })}
            </div>
            <div>
                <div className="btn-navbar-hide" onClick={handleViewAll}>
                    <i className="fa fa-times-circle" style={{ paddingRight: 5 }} aria-hidden="true"></i>{translated.hideText}<div></div>
                </div>
            </div>

        </div>
    );
}

export default ShowFilterObject;
