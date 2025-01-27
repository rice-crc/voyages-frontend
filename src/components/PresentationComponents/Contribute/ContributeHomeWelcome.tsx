import '@/style/contributeContent.scss';
import { Button } from '@mui/material';
import { getDisplayButtons } from '@/utils/functions/contribuitePath';
import { useNavigation } from '@/hooks/useNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { translationLanguagesContribute } from '@/utils/functions/translationLanguages';

const ContributeHomeWelcome: React.FC = () => {
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);
  const translatedContribute = translationLanguagesContribute(languageValue);

  const { handleClickSideBar } = useNavigation();

  const buttons = getDisplayButtons(translatedContribute);

  return (
    <div className="contribute-content">
      <h1 className="page-title-1">
        {translatedContribute.contributeContributeHomeWelcome}
      </h1>
      <span></span>
      <div>
        {buttons.map((btn) => (
          <Button
            onClick={() => handleClickSideBar(btn.path)}
            key={btn.nameBtn}
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: 'rgb(55, 148, 141)',
              color: '#fff',
              marginRight: '0.5rem',
              height: 32,
              fontSize: '0.85rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(6, 186, 171, 0.83)',
              },
            }}
          >
            {btn.nameBtn}
          </Button>
        ))}
      </div>
    </div>
  );
};
export default ContributeHomeWelcome;
