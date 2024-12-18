import { setStyleName } from '@/redux/getDataSetCollectionSlice';
import { setPeopleEnslavedStyleName } from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import { resetAll } from '@/redux/resetAllSlice';
import { AppDispatch, RootState } from '@/redux/store';
import '@/style/landing.scss';
import { translationHomepage } from '@/utils/functions/translationLanguages';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
interface ButtonLearnMoreProps {
  path: string;
  styleName?: string;
  stylePeopleName?: string;
}

const ButtonLearnMore = ({
  path,
  styleName,
  stylePeopleName,
}: ButtonLearnMoreProps) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const handleClikLink = () => {
    dispatch(resetAll());
    navigate(path);
    if (styleName) {
      dispatch(setStyleName(styleName));
    }
    if (stylePeopleName) {
      dispatch(setPeopleEnslavedStyleName(stylePeopleName));
    }
  };
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const translatedHomepage = translationHomepage(languageValue);
  return (
    <div className="learn-more-btn" onClick={handleClikLink}>
      <span>{translatedHomepage.learnMore}</span>
    </div>
  );
};
export default ButtonLearnMore;
