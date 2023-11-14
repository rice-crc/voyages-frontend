import '@/style/homepage.scss'

interface ResetAllButtonProps {
    varName: string;
    clusterNodeKeyVariable?: string
    clusterNodeValue?: string;
    handleResetAll: () => void;
}

export const ResetAllButton = (props: ResetAllButtonProps) => {
    const { varName, clusterNodeKeyVariable, clusterNodeValue, handleResetAll } = props;

    return (
        <>
            {(varName !== '' || (clusterNodeKeyVariable && clusterNodeValue)) && (
                <div className="btn-navbar-reset-all" onClick={handleResetAll}>
                    <i aria-hidden="true" className="fa fa-times"></i>
                    <span>Reset all</span>
                </div>
            )}</>
    )
}