import HeaderLogo from '@/components/NavigationComponents/Header/HeaderLogo';
import '@/style/estimates.scss';
import '@/style/Nav.scss';

import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import HeaderLogoEstimate from '@/components/NavigationComponents/Header/HeaderLogoEstimate';
import { FunctionComponent } from 'react';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { resetAll } from '@/redux/resetAllSlice';
import SaveSearchComponent from '@/components/FilterComponents/SaveSearchComponent/SaveSearchComponent';
import { usePageRouter } from '@/hooks/usePageRouter';
interface EstimatesNavBarProps {
    handleViewAll: () => void
}
const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 220,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
    },
});

const EstimatesNavBar: FunctionComponent<EstimatesNavBarProps> = ({ handleViewAll }) => {
    const dispatch: AppDispatch = useDispatch();
    const { currentBlockName } = usePageRouter();
    const resetAllEstimate = () => {
        dispatch(resetAll());
        const keysToRemove = Object.keys(localStorage);

        keysToRemove.forEach((key) => {
            localStorage.removeItem(key);
        });
    }

    return (
        <div className="nav-header">
            <span className='header-logo-icon'>
                <HeaderLogoEstimate />
                <div>Estimates: Trans-Atlantic Slave Trade</div>
            </span>
            <div className="navbar-subtitle flex-navbar">
                <div className='flex-navbar'>
                    <div className="navbar-subitem">
                        Current Query {' '}
                        <CustomWidthTooltip title={<span className="sr-only-tooltip">For purposes of calculation, estimates of embarked and disembarked slaves in tables, the timeline, and maps have been rounded to integers. When users cite any number, they are advised to round it to the nearest hundred.</span>
                        } placement="bottom" >
                            <i className="fa fa-question-circle tooltip-pointer" data-toggle="tooltip" data-placement="top" title="" aria-hidden="true" ></i>
                        </CustomWidthTooltip>
                    </div>
                    <div className="navbar-subitem">
                        <a data-toggle="collapse" href="#panelCollapse" role="button" aria-expanded="false" aria-controls="panelCollapse">
                            <div className="btn-navbar" onClick={handleViewAll}>
                                <i className="fa fa-filter" aria-hidden="true"></i>
                                View All
                            </div>
                        </a>
                    </div>
                    <div className="navbar-subitem">
                        <a role="button" onClick={resetAllEstimate}>
                            <div className="btn-navbar">
                                <i className="fa fa-times" aria-hidden="true"></i>
                                Reset All
                            </div>
                        </a>
                    </div>
                </div>
                <div>{(currentBlockName === 'tables' || currentBlockName === '') && <SaveSearchComponent />}</div>

            </div>

        </div>
    )
}
export default EstimatesNavBar