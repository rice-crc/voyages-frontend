import '@/style/estimates.scss';
import '@/style/Nav.scss';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import HeaderLogoEstimate from '@/components/NavigationComponents/Header/HeaderLogoEstimate';
import { FunctionComponent } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { resetAll } from '@/redux/resetAllSlice';
import SaveSearchComponent from '@/components/FilterComponents/SaveSearchComponent/SaveSearchComponent';
import { usePageRouter } from '@/hooks/usePageRouter';
import LanguagesDropdown from '@/components/SelectorComponents/DropDown/LanguagesDropdown';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';

interface EstimatesNavBarProps {
  handleViewAll: () => void;
}
const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: '#fff',
    padding: 10,
  },
});

const EstimatesNavBar: FunctionComponent<EstimatesNavBarProps> = ({
  handleViewAll,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { currentBlockName } = usePageRouter();
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );

  const resetAllEstimate = () => {
    dispatch(resetAll());
    const keysToRemove = Object.keys(localStorage);
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const translatedEstimates = translationLanguagesEstimatePage(languageValue);

  return (
    <div className="nav-header">
      <span className="header-logo-icon-estimate">
        <div className="logo-header-estimate">
          <HeaderLogoEstimate />
          <div>{translatedEstimates.title}</div>
        </div>
        <div>
          {' '}
          <LanguagesDropdown />
        </div>
      </span>
      <div className="navbar-subtitle flex-navbar">
        <div className="flex-navbar">
          <div className="navbar-subitem">
            {translatedEstimates.queries}{' '}
            <CustomWidthTooltip
              title={
                <span className="sr-only-tooltip">
                  {translatedEstimates.queriesTooltip}
                </span>
              }
              placement="bottom"
            >
              <i
                className="fa fa-question-circle tooltip-pointer"
                data-toggle="tooltip"
                data-placement="top"
                title=""
                aria-hidden="true"
              ></i>
            </CustomWidthTooltip>
          </div>
          <div className="navbar-subitem">
            <a
              data-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="panelCollapse"
            >
              <div className="btn-navbar" onClick={handleViewAll}>
                <i className="fa fa-filter" aria-hidden="true"></i>
                {translatedEstimates.viewAll}
              </div>
            </a>
          </div>
          <div className="navbar-subitem">
            <a role="button" onClick={resetAllEstimate}>
              <div className="btn-navbar">
                <i className="fa fa-times" aria-hidden="true"></i>
                {translatedEstimates.resetAll}
              </div>
            </a>
          </div>
        </div>
        <div>{currentBlockName !== 'maps' && <SaveSearchComponent />}</div>
      </div>
    </div>
  );
};
export default EstimatesNavBar;
