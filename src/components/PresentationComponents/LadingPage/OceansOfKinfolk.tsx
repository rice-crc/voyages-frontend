import React from 'react';
import '@/style/texas-bound.scss';
import OceansOfKin from '@/assets/OceansOfK.svg';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';

const OceansOfKinfolk: React.FC = () => {
  return (
    <div className="container-texas">
      <div className="texas-bound">
        <div className="texas-bound-detail">
          <div>
            <h1>Oceans of Kinfolk</h1>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
          <ButtonLearnMore path="" />
        </div>
        <div className="texas-bound-bg">
          <img src={OceansOfKin} alt="Oceans of Kinfolk" className="tx-img" />
        </div>
      </div>
    </div>
  );
};

export default OceansOfKinfolk;
