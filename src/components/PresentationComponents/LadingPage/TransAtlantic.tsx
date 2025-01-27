import React from 'react';
import '@/style/landing.scss';
import TRANSATLANTICIMG from '@/assets/transAtlantic.svg';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import ButtonLists from '@/components/SelectorComponents/ButtonComponents/ButtonLists';
import {
  TRANSATLANTICPAGE,
  TRANSATLANTIC,
  ASSESSMENT,
  ESTIMATES,
  BLOGPAGE,
  ACCOUNTS,
} from '@/share/CONST_DATA';
import { translationHomepage } from '@/utils/functions/translationLanguages';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const TransAtlantic: React.FC = () => {
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const translatedHomepage = translationHomepage(languageValue);

  const lists = [
    { name: `${translatedHomepage.btnAbout}`, url: `${BLOGPAGE}/tag/about` },
    {
      name: `${translatedHomepage.btnDatabase}`,
      url: `${TRANSATLANTICPAGE}#voyages`,
    },
    {
      name: `${translatedHomepage.btnEstimates}`,
      url: `/${ASSESSMENT}/${ESTIMATES}`,
    },
    { name: `${translatedHomepage.btnEssays}`, url: `${BLOGPAGE}/tag/essays` },
    {
      name: `${translatedHomepage.btnDownloads}`,
      url: `${BLOGPAGE}/tag/downloads`,
    },
    { name: `${translatedHomepage.btnContribute}`, url: `${ACCOUNTS}signin` },
  ];

  return (
    <div className="container-african">
      <div className="african-content">
        <div className="atlatic-content-bg">
          <Link
            to={`${TRANSATLANTICPAGE}#voyages`}
            className="enslavers-content-bg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={TRANSATLANTICIMG}
              alt="Trans-Atlantic"
              className="african-img"
            />
          </Link>
        </div>
        <div className="african-content-detail">
          <h1>{translatedHomepage.homeTrans}</h1>
          <p>{translatedHomepage.homeTransDes}</p>
          <ButtonLearnMore
            path={`${TRANSATLANTICPAGE}#voyages`}
            styleName={TRANSATLANTIC}
          />
          <ButtonLists lists={lists} />
        </div>
      </div>
    </div>
  );
};

export default TransAtlantic;
