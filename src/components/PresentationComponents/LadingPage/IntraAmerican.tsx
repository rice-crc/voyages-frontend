import React from 'react';
import '@/style/intra-american.scss';
import INTRAMERCAN from '@/assets/Intra-American.svg';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import ButtonLists from '@/components/SelectorComponents/ButtonComponents/ButtonLists';
import {CONTRIBUTE, INTRAAMERICANPAGE, ABOUTPAGE, DOWNLOADS, BLOGPAGE} from '@/share/CONST_DATA';
import {useSelector} from 'react-redux';
import {translationHomepage} from '@/utils/functions/translationLanguages';
import {RootState} from '@/redux/store';
import {Link} from 'react-router-dom';

const IntraAmerican: React.FC = () => {
    const {languageValue} = useSelector((state: RootState) => state.getLanguages);
    const translatedHomepage = translationHomepage(languageValue);

    const lists = [
        {name: `${translatedHomepage.btnAbout}`, url: `${BLOGPAGE}/tag/about`},
        {name: `${translatedHomepage.btnDatabase}`, url: `${INTRAAMERICANPAGE}#voyages`},
        {name: `${translatedHomepage.btnDownloads}`, url: `${BLOGPAGE}/tag/downloads`},
        {name: `${translatedHomepage.btnContribute}`, url: `${CONTRIBUTE}`},
    ];

    return (
        <div className="container-intra-american">
            <div className="intra-american">
                <div className="intra-american-detail">
                    <h1>{translatedHomepage.homeIntra}</h1>
                    <p>{translatedHomepage.homeIntraDes}</p>
                    <ButtonLearnMore path={`${INTRAAMERICANPAGE}#voyages`} styleName='intra-american' />
                    <ButtonLists lists={lists} />
                </div>
                <div className="intra-american-bg">
                    <Link to={`${INTRAAMERICANPAGE}#voyages`} className="enslavers-content-bg" target="_blank" rel="noopener noreferrer" >
                        <img src={INTRAMERCAN} alt="Intra-American" className="intra-american-img" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default IntraAmerican;
