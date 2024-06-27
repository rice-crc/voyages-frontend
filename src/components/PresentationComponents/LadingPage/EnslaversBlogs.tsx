import React from 'react';
import '@/style/landing.scss';
import ENSLAVERS from '@/assets/enslaver_enslaved_LOC_02.jpg';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import { ENSALVERSPAGE, TRANSATLANTICENSLAVERS } from '@/share/CONST_DATA';
import { translationHomepage } from '@/utils/functions/translationLanguages';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
const EnslaversBlogs: React.FC = () => {
    const { languageValue } = useSelector((state: RootState) => state.getLanguages);
    const translatedHomepage = translationHomepage(languageValue)
    return (
        <div className="container-enslavers">
            <div className="enslavers-content">
                <div className="enslavers-content-bg">
                    <img src={ENSLAVERS} alt="Enslavers" className="register-img" />
                </div>
                <div className="enslavers-content-detail">
                    <h1>{translatedHomepage.homeEnslavers}</h1>
                    <p>{translatedHomepage.homeEnslaversDes}</p>
                    <ButtonLearnMore path={`${ENSALVERSPAGE}${TRANSATLANTICENSLAVERS}#people`} />
                </div>
            </div>
        </div>
    );
};

export default EnslaversBlogs;
