import React from 'react';
import '@/style/landing.scss';
import ENSLAVERS from '@/assets/enslaver.png';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
const EnslaversBlogs: React.FC = () => {
    return (
        <div className="container-enslavers">
            <div className="enslavers-content">
                <div className="enslavers-content-bg">
                    <img src={ENSLAVERS} alt="logo" className="register-img" />
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
                    <ButtonLearnMore />
                </div>
            </div>
        </div>
    );
};

export default EnslaversBlogs;
