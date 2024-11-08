import React from 'react';
import '@/style/landing.scss';
import REGISTERSOUTH from '@/assets/registerOfAfricans.png';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import {DOCUMENTPAGE} from '@/share/CONST_DATA';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {translationHomepage} from '@/utils/functions/translationLanguages';
import {Link} from 'react-router-dom';
const SouthSeaCompanyDocuments: React.FC = () => {
    const {languageValue} = useSelector((state: RootState) => state.getLanguages);
    const translatedHomepage = translationHomepage(languageValue);

    return (
        <div className="container-shouth-sea">
            <div className="shouth-sea-content">
                <div className="shouth-sea-content-detail">
                    <h1>{translatedHomepage.homeDocument}</h1>
                    <p>{translatedHomepage.homeDocumentDes}</p>
                    <ButtonLearnMore path={DOCUMENTPAGE} />
                </div>
                <div className="shouth-sea-content-bg">
                    <Link to={`/document`}>
                        <img src={REGISTERSOUTH} alt="South Sea Company Documents" className="register-img" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SouthSeaCompanyDocuments;
