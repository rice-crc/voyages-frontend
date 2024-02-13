import CustomCheckboxDisEmbarkationGroup from '@/components/SelectorComponents/SelectDrowdown/CustomCheckboxDisEmbarkationGroup';
import CustomCheckboxEmbarkationGroup from '@/components/SelectorComponents/SelectDrowdown/CustomCheckboxEmbarkationGroup';
import {
    disembarkationListData,
    embarkationListData,
} from '@/utils/flatfiles/estimate_text';
import { Button } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useState } from 'react';

const Regions: React.FC = () => {
    const [checkedListEmbarkation, setCheckedListEmbarkation] = useState<
        Record<string, CheckboxValueType[]>
    >({});
    const [checkedListDisEmbarkation, setCheckedListDisEmbarkation] = useState<
        Record<string, CheckboxValueType[]>
    >({});

    const handleSetCheckedListEmbarkation = (label: string, list: CheckboxValueType[]) => {
        setCheckedListEmbarkation((prev) => ({ ...prev, [label]: list }));
        return list;
    };

    const handleSelectAllEmbarkation = () => {
        setCheckedListEmbarkation(() => {
            const updatedList: Record<string, CheckboxValueType[]> = {};
            embarkationListData.forEach((group) => {
                updatedList[group.label] = group.options;
            });
            return updatedList;
        });
    };

    const handleDeselectAllEmbarkation = () => {
        setCheckedListEmbarkation(() => {
            const updatedList: Record<string, CheckboxValueType[]> = {};
            embarkationListData.forEach((group) => {
                updatedList[group.label] = [];
            });
            return updatedList;
        });

    };

    const handleSetCheckedListDisEmbarkation = (label: string, list: CheckboxValueType[]) => {
        setCheckedListDisEmbarkation((prev) => ({ ...prev, [label]: list }));
        return list;
    };
    const handleSelectAllDisEmbarkation = () => {
        setCheckedListDisEmbarkation(() => {
            const updatedList: Record<string, CheckboxValueType[]> = {};
            disembarkationListData.forEach((group) => {
                updatedList[group.label] = group.options;
            });
            return updatedList;
        });
    };

    const handleDeselectAllDisEmbarkation = () => {
        setCheckedListDisEmbarkation(() => {
            const updatedList: Record<string, CheckboxValueType[]> = {};
            disembarkationListData.forEach((group) => {
                updatedList[group.label] = [];
            });
            return updatedList;
        });
    };
    return (
        <>
            <h4>Embarkation Regions</h4>
            {embarkationListData.map((group, index) => (
                <div key={`${group.label}-${index}`}>
                    <CustomCheckboxEmbarkationGroup
                        plainOptions={group.options}
                        label={group.label}
                        varName={group.varName}
                        show={group.show}
                        checkedList={checkedListEmbarkation[group.label] || []}
                        setCheckedList={(list: CheckboxValueType[]) =>
                            handleSetCheckedListEmbarkation(group.label, list)
                        }
                    />
                </div>
            ))}
            <div className="reset-btn-estimate">
                <Button
                    onClick={handleSelectAllEmbarkation}
                    style={{
                        backgroundColor: '#008ca8',
                        borderColor: '#008ca8',
                        color: '#fff',
                    }}
                >
                    Select All
                </Button>
                <Button onClick={handleDeselectAllEmbarkation} className="deselec-btn">
                    Deselect All
                </Button>
            </div>

            <br />
            <h4>Disembarkation Regions</h4>
            {disembarkationListData.map((group, index) => (
                <div key={`${group.label}-${index}`}>
                    <CustomCheckboxDisEmbarkationGroup
                        label={group.label}
                        varName={group.varName}
                        plainOptions={group.options}
                        show={group.show}
                        checkedList={checkedListDisEmbarkation[group.label] || []}
                        setCheckedList={(list: CheckboxValueType[]) =>
                            handleSetCheckedListDisEmbarkation(group.label, list)
                        }
                    />
                </div>
            ))}
            <div className="reset-btn-estimate">
                <Button
                    onClick={handleSelectAllDisEmbarkation}
                    style={{
                        backgroundColor: '#008ca8',
                        borderColor: '#008ca8',
                        color: '#fff',
                    }}
                >
                    Select All
                </Button>
                <Button
                    onClick={handleDeselectAllDisEmbarkation}
                    className="deselec-btn"
                >
                    Deselect All
                </Button>
            </div>
        </>
    );
};

export default Regions;
