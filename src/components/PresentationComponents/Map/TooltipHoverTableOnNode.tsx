import { NodeAggroutes } from '@/share/InterfaceTypesMap';
import '@/style/table-popup.scss';
import { nodeTypeOrigin, nodeTypePostDisembarkation } from '@/share/CONST_DATA';
import { Divider } from '@mui/material';

interface TooltipHoverTableOnNodeProps {
    childNodesData: NodeAggroutes[];
    nodeType: string;
    handleSetClusterKeyValue: (value: string, nodeType: string) => void
}

export const TooltipHoverTableOnNode = ({
    childNodesData, nodeType, handleSetClusterKeyValue
}: TooltipHoverTableOnNodeProps) => {
    const maxDisplayCount = 4;

    if (!childNodesData) {
        return (
            <div>
                No child nodes available.
            </div>
        );
    }

    const displayedNodes = childNodesData!.slice(0, maxDisplayCount);
    const remainingNodes = childNodesData!.slice(maxDisplayCount);

    const tatalOriginCount = childNodesData?.reduce(
        (total, node) => total + node.weights.origin!,
        0
    );

    const tatalPostDisembarkationCount = childNodesData?.reduce(
        (total, node) => total + node.weights['post-disembarkation']!,
        0
    );
    const hederTableOrigin = (
        <tr>
            <td>
                Language Group{' '}
                <span
                    id="origins_map_key_pill"
                    data-toggle="tooltip"
                    className="badge badge-pill badge-secondary tooltip-pointer"
                    title=""
                    data-original-title="Origins are derived from user contributions."
                >
                    IMP{' '}
                </span>
            </td>
            <td>Number of Liberated Africans with Identified Languages</td>
        </tr>
    );

    const hederTablePostDisembarkation = (
        <tr>
            <td>Last Known Location</td>
            <td>Number of Liberated Africans</td>
        </tr>
    );

    const hederOtherType = (
        <tr>
            <td>
                Language Group{' '}
                <span
                    id="origins_map_key_pill"
                    data-toggle="tooltip"
                    className="badge badge-pill badge-secondary tooltip-pointer"
                    title=""
                    data-original-title="Origins are derived from user contributions."
                >
                    IMP{' '}
                </span>
            </td>
            <td>Number of Liberated Africans with Identified Languages</td>
        </tr>
    );


    const textHederOfTableOtherType = <div className="embarkations-type">
        <a href="#" onClick={() => console.log('textHederOfTableOtherType')}>1926 Liberated Africans embarked</a> in Loango, of whom 707 have been identified as belonging to
        <a href="#" onClick={() => console.log('textHederOfTableOtherType')}>16 language groups</a><Divider style={{ margin: '0.75rem 0', opacity: 0.5 }} />
    </div>

    return (
        <> {nodeType !== nodeTypePostDisembarkation && nodeType !== nodeTypeOrigin && textHederOfTableOtherType}

            <table className="lgmaptable" >
                <tbody>
                    {nodeType === nodeTypeOrigin ? hederTableOrigin : nodeType === nodeTypePostDisembarkation ? hederTablePostDisembarkation : hederOtherType}
                    {displayedNodes.map((node, index) => (
                        <tr key={`${node.id}-${index}`}>
                            <td>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSetClusterKeyValue(node.data.name!, nodeType);
                                    }}
                                >{node.data.name!}</a>
                            </td>
                            <td> {nodeType === nodeTypeOrigin ? node.weights.origin! : node.weights['post-disembarkation']}</td>
                        </tr>
                    ))}
                    {remainingNodes.length > 0 && (
                        <tr>
                            <td>
                                {remainingNodes.length} other Language Groups
                            </td>
                            <td>
                                {remainingNodes.reduce((total, node) => total + (nodeType === nodeTypeOrigin ? node.weights.origin! : node.weights['post-disembarkation']!), 0)}
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td>Total</td>
                        <td>{nodeType === nodeTypeOrigin ? tatalOriginCount : tatalPostDisembarkationCount}</td>
                    </tr>
                </tbody>
            </table>
        </>

    );
};
