import React from 'react';
import '@/style/landing.scss';
import ENSLAVERS from '@/assets/enslavers-blog.png';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import { ENSALVERSPAGE, TRANSATLANTICENSLAVERS } from '@/share/CONST_DATA';
const EnslaversBlogs: React.FC = () => {
    return (
        <div className="container-enslavers">
            <div className="enslavers-content">
                <div className="enslavers-content-bg">
                    <img src={ENSLAVERS} alt="Enslavers" className="register-img" />
                </div>
                <div className="enslavers-content-detail">
                    <h1>Enslavers</h1>
                    <p>
                        At the foundation of the African diaspora lay an enslaver (or an owner),
                        the enslaved person, and the movement of the latter induced by the former
                        (this could be one of the various slave trades, a runaway slave or a single transaction between buyer and seller).
                        Any movement of property or changes in that property’s status generated documentation – in the case of both slaves
                        and their owners, these were typically accounts, baptismal certificates, newspapers,
                        or shipping records.
                    </p>
                    <ButtonLearnMore path={`${ENSALVERSPAGE}${TRANSATLANTICENSLAVERS}#people`} />
                </div>
            </div>
        </div>
    );
};

export default EnslaversBlogs;
