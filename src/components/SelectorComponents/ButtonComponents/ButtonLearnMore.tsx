

import { setStyleName } from '@/redux/getDataSetCollectionSlice';
import { setPeopleEnslavedStyleName } from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import { resetAll } from '@/redux/resetAllSlice';
import { AppDispatch, } from '@/redux/store';
import '@/style/landing.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
interface ButtonLearnMoreProps {
    path: string
    styleName?: string
    stylePeopleName?: string
}

const ButtonLearnMore = ({ path, styleName, stylePeopleName }: ButtonLearnMoreProps) => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const handleClikLink = () => {
        dispatch(resetAll())
        navigate(path)
        if (styleName) {
            dispatch(setStyleName(styleName))
        }
        if (stylePeopleName) {
            dispatch(setPeopleEnslavedStyleName(stylePeopleName));
        }
    }

    return (
        (
            <div className="learn-more-btn" onClick={handleClikLink}>
                <span>Learn more</span>
            </div>
        )
    )
}
export default ButtonLearnMore