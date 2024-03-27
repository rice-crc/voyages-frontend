import React from 'react';
import '@/style/landing.scss';
import AFRICANORIGINS from '@/assets/People_of_the_Atlantic.svg';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import { AFRICANORIGINSPAGE, ENSALVEDPAGE, PASTHOMEPAGE } from '@/share/CONST_DATA';

const AfricanOrigins: React.FC = () => {
    return (
        <div className="container-african">
            <div className="african-content">
                <div className="african-content-bg">
                    <img src={AFRICANORIGINS} alt="African Origins" className="african-img" />
                </div>
                <div className="african-content-detail">
                    <h1>African Origins</h1>
                    <p>
                        During the last 60 years of the trans-Atlantic slave trade, courts
                        around the Atlantic basins condemned over two thousand vessels for
                        engaging in the traffic and recorded the details of captives found
                        on board including their African names. The African Names Database
                        was created from these records, now located in the Registers of
                        Liberated Africans at the Sierra Leone National Archives, Freetown,
                        as well as Series FO84, FO313, CO247 and CO267 held at the British
                        National Archives in London.
                    </p>
                    <ButtonLearnMore path={`${ENSALVEDPAGE}${AFRICANORIGINSPAGE}#map`} stylePeopleName={'african-origins'} />
                </div>
            </div>
        </div>
    );
};

export default AfricanOrigins;
