
import { Button, Form, Input } from "antd";
import { useState } from "react";
import '@/style/estimates.scss'

const TimeFrame = () => {
    const [start, setStart] = useState<string>('1501');
    const [end, setEnd] = useState<string>('1866');

    const onFinish = (values: any) => {
        console.log('Received values from form: ', values);
    };

    const handleStart = (e: React.ChangeEvent<HTMLInputElement>) => {
        const startValue = e.target.value;
        setStart(startValue);
    };
    const handleEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const endValue = e.target.value;
        setEnd(endValue);
    };

    return (
        <div>
            <div id="form:_idJsp7" className="__web-inspector-hide-shortcut__">
                <div className="sidebar-label-form">
                    <Form
                        className='sidebar-label'
                        name="data-from-to"
                        onFinish={onFinish}
                        layout="horizontal"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 24 }}
                        style={{ maxWidth: 600 }}
                    >
                        <Form.Item
                            label="Show data from"
                            style={{ marginBottom: 0, width: '100%' }}

                        >
                            <Input
                                type="text"
                                value={start}
                                onChange={handleStart}
                                placeholder="from"
                                style={{ width: '32%', marginRight: '8px', borderColor: '#1b1a1a' }}
                            />
                            <span className="time-from-to">to</span>
                            <Input
                                type="text"
                                value={end}
                                onChange={handleEnd}
                                placeholder="to"
                                style={{ width: '32%', borderColor: '#1b1a1a' }}
                            />
                        </Form.Item>
                    </Form>
                </div>
                <div className="text-description">Full extent of coverage by estimates is {start} - {end}.</div>
                <Button style={{ backgroundColor: '#008ca8', borderColor: '#008ca8', color: '#fff' }} >Reset</Button>
            </div>
        </div>
    )
}

export default TimeFrame;