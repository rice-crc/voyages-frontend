import React from 'react';
import '@/style/landing.scss';
import REGISTERSOUTH from '@/assets/register.png';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import { DOCUMENTPAGE } from '@/share/CONST_DATA';
const SouthSeaCompanyDocuments: React.FC = () => {
    return (
        <div className="container-shouth-sea">
            <div className="shouth-sea-content">
                <div className="shouth-sea-content-bg">
                    <img src={REGISTERSOUTH} alt="logo" className="register-img" />
                </div>
                <div className="shouth-sea-content-detail">
                    <h1>South Sea Company Documents</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur.
                    </p>
                    <ButtonLearnMore path={DOCUMENTPAGE} />
                </div>
            </div>
        </div>
    );
};

export default SouthSeaCompanyDocuments;
