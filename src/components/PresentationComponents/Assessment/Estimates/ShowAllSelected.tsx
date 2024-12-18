import { RootState } from '@/redux/store';
import { CheckboxValueType } from '@/share/InterfaceTypes';
import '@/style/estimates.scss';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';
import { Button } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface ShowAllSelectedProps {
  setViewAll: React.Dispatch<React.SetStateAction<boolean>>;
  ariaExpanded: boolean;
}
const ShowAllSelected: FunctionComponent<ShowAllSelectedProps> = ({
  setViewAll,
  ariaExpanded,
}) => {
  const { checkedListEmbarkation, checkedListDisEmbarkation, selectedFlags } =
    useSelector((state: RootState) => state.getEstimateAssessment);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const [flagNation, setFlagNation] = useState<CheckboxValueType[]>([]);
  const [embarkationShow, setEmbarkationShow] = useState<CheckboxValueType[]>(
    []
  );
  const [disembarkationShow, setDisEmbarkationShow] = useState<
    CheckboxValueType[]
  >([]);

  useEffect(() => {
    const updateNation: CheckboxValueType[] = [];

    selectedFlags.forEach((value) => {
      updateNation.push(value);
    });
    setFlagNation(updateNation);
    const updatedShowEmbarktion: CheckboxValueType[] = [];
    Object.values(checkedListEmbarkation).forEach((valueArray) => {
      updatedShowEmbarktion.push(...valueArray);
    });
    setEmbarkationShow(updatedShowEmbarktion);

    const updatedShowDisEmbarktion: CheckboxValueType[] = [];
    Object.values(checkedListDisEmbarkation).forEach((valueArray) => {
      updatedShowDisEmbarktion.push(...valueArray);
    });
    setDisEmbarkationShow(updatedShowDisEmbarktion);
  }, [checkedListEmbarkation, checkedListDisEmbarkation, selectedFlags]);

  const translatedEstimates = translationLanguagesEstimatePage(languageValue);

  return (
    <div id="panelCollapse" className="panel-list" v-if="hasCurrentQuery">
      <div className="panel-list-item-wrapper">
        <div className="row-selected">
          <h4 className="col-selected">
            {translatedEstimates.selectNation}
            {' :'}
          </h4>
          <span className="col-selected-all">
            {!flagNation ? 'all' : flagNation.join(', ')}
          </span>
        </div>
        <div className="row-selected">
          <h4 className="col-selected">
            {translatedEstimates.selectEmbarkation}
            {' :'}
          </h4>
          <span className="col-selected-all">
            {!embarkationShow ? 'all' : embarkationShow.join(', ')}
          </span>
        </div>
        <div className="row-selected">
          <h4 className="col-selected">
            {translatedEstimates.selectDesEmbarkation}
            {' :'}
          </h4>
          <span className="col-selected-all">
            {!disembarkationShow ? 'all' : disembarkationShow.join(', ')}
          </span>
        </div>
      </div>
      <div>
        <Button
          className="btn-panel deselec-btn-hide"
          onClick={() => setViewAll(false)}
        >
          <i
            className="fa fa-times-circle"
            style={{ paddingRight: 5 }}
            aria-hidden="true"
          ></i>
          {translatedEstimates.hideText}
          <div></div>
        </Button>
      </div>
    </div>
  );
};

export default ShowAllSelected;
