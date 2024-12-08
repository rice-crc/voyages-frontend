
import { resetAll } from '@/redux/resetAllSlice';
import { AppDispatch } from '@/redux/store';
import '@/style/landing.scss';
import { useDispatch } from 'react-redux';
import {  useNavigate } from 'react-router-dom';

interface ListBtnItem {
    name: string
    url: string
}
interface ButtonListsProps {
    lists: ListBtnItem[]
}

const ButtonLists: React.FC<ButtonListsProps> = ({ lists }) => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const handleClikLink = (url: string) => {
        dispatch(resetAll())
        navigate(url)
    }

    return (
        <div className="list-btn">
            {lists.map((list) => (
                <div key={`${list.name}-${list.url}`} onClick={() => handleClikLink(list.url)}>
                    <div className='btn-list-name'>{list.name}</div>
                </div>
            ))}
        </div>
    )
}
export default ButtonLists