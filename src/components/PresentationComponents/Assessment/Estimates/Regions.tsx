import { Button, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState } from "react";

const Regions = () => {
    const [embarkationAfrica, setEmbarkationAfrica] = useState<string>('Africa');
    const [selectedEmbarkation, setSelectedEmbarkation] = useState<string[]>([]);
    const [disembarkationAfrica, setSelectedDisembarkation] = useState<string[]>([]);
    const disembarkationList = [
        'Africa',
        'Brazil',
        'British Caribbean',
        ' Danish West Indies',
        'Dutch Americas',
        'Europe',
        'French Caribbean',
        'Mainland North America',
        'Spanish Americas'
    ]

    return (
        <div>

            <div>
                <div>Embarkation Regions</div>
                <Checkbox
                    className='sidebar-label'
                    key={embarkationAfrica}
                // checked={selectedFlags.includes(embarkationAfrica)}
                // onChange={(e) => onChangeEmbarkationRegions(e, embarkationAfrica)}
                >
                    {embarkationAfrica}
                </Checkbox>

            </div>
            <div className="reset-btn-estimate">
                <Button style={{ backgroundColor: '#008ca8', borderColor: '#008ca8', color: '#fff' }} >Select All</Button>
            </div>
            <br />
            <div>
                <div>Disembarkation Regions</div>
                {disembarkationList.map((value) => (
                    <div>
                        <Checkbox
                            className='sidebar-label'
                            key={value}
                        // checked={selectedFlags.includes(embarkationAfrica)}
                        // onChange={(e) => onChangeEmbarkationRegions(e, embarkationAfrica)}
                        >
                            {value}
                        </Checkbox>
                        <br />
                    </div>
                ))}

            </div>
            <div className="reset-btn-estimate">
                <Button style={{ backgroundColor: '#008ca8', borderColor: '#008ca8', color: '#fff' }} >Select All</Button>
            </div>

        </div>
    )
}

export default Regions;