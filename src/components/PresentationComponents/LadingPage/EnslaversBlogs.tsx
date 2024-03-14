import React from 'react';
import '@/style/landing.scss';
import ENSLAVERS from '@/assets/enslavers-blog.png';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import { ENSALVERSPAGE, INTRAAMERICANENSLAVERS, PASTHOMEPAGE, allEnslavers } from '@/share/CONST_DATA';
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur.
                    </p>
                    <ButtonLearnMore path={`${PASTHOMEPAGE}${ENSALVERSPAGE}${INTRAAMERICANENSLAVERS}#people`} />
                </div>
            </div>
        </div>
    );
};

export default EnslaversBlogs;
