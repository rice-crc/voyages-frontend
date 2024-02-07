import { Button } from "antd";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState } from "react";
import '@/style/estimates.scss'

const Flag = () => {
    const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
    const flagText = [
        'Spain / Uruguay',
        'Portugal / Brazil',
        'Great Britain',
        'Netherlands',
        'U.S.A.',
        'France',
        'Denmark / Baltic'
    ]
    const onChange = (e: CheckboxChangeEvent, value: string) => {
        const updatedSelectedFlags = e.target.checked
            ? [...selectedFlags, value]
            : selectedFlags.filter((flag) => flag !== value);

        console.log('Selected flags:', updatedSelectedFlags);
        setSelectedFlags(updatedSelectedFlags);
    };
    return (
        <>
            {
                flagText.map((value) => (
                    <div>

                        <Checkbox
                            className='sidebar-label'
                            key={value}
                            checked={selectedFlags.includes(value)}
                            onChange={(e) => onChange(e, value)}
                        >
                            {value}
                        </Checkbox>
                        <br />

                    </div>
                ))
            }
            <div className="reset-btn-estimate">
                <Button style={{ backgroundColor: '#008ca8', borderColor: '#008ca8', color: '#fff' }} >Reset</Button>
            </div>
        </>

    )
}

export default Flag;