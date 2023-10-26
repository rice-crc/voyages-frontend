

import { setStyleName } from '@/redux/getDataSetCollectionSlice';
import { setPeopleEnslavedStyleName } from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import { AppDispatch, } from '@/redux/store';
import '@/style/landing.scss';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
interface ButtonLearnMoreProps {
    path: string
    styleName?: string
    stylePeopleName?: string
}

const ButtonLearnMore = ({ path, styleName, stylePeopleName }: ButtonLearnMoreProps) => {
    const dispatch: AppDispatch = useDispatch();

    const handleClikLink = () => {
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
                <Link to={`/${path}`}>Learn more</Link>
            </div>
        )
    )
}
export default ButtonLearnMore