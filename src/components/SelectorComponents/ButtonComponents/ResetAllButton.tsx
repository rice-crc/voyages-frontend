import { RootState } from '@/redux/store';
import '@/style/homepage.scss'
import { useSelector } from 'react-redux';

interface ResetAllButtonProps {
    varName: string;
    clusterNodeKeyVariable?: string
    clusterNodeValue?: string;
    handleResetAll: () => void;
}

export const ResetAllButton = (props: ResetAllButtonProps) => {
    const { varName, clusterNodeKeyVariable, clusterNodeValue, handleResetAll } = props;
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);

    return (
        <>
            {(varName !== '' || filtersObj?.length > 1 || (clusterNodeKeyVariable && clusterNodeValue)) && (
                <div className="btn-navbar-reset-all" onClick={handleResetAll}>
                    <i aria-hidden="true" className="fa fa-times"></i>
                    <span>Reset all</span>
                </div>
            )}</>
    )
}