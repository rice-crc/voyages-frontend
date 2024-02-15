import { Button, Input } from 'antd';
import '@/style/estimates.scss'

const { TextArea } = Input;


const QueryLink = () => {
    return (
        <div>
            <div className='sidebar-label' >To reactivate the current query in the future, copy the following URL and then paste it into the address bar:</div>
            <div className='text-query-link'>
                <TextArea rows={2} maxLength={6} style={{ borderColor: '#1b1a1a' }} />
            </div>
            <div className="reset-btn-estimate">
                <Button style={{ backgroundColor: '#008ca8', borderColor: '#008ca8', color: '#fff' }} >Create Link</Button>
            </div>
        </div>
    )
}

export default QueryLink;