import React from 'react';
import '@/style/texas-bound.scss';
import TEXAS from '@/assets/texasbound1.png';
import TEXASBOUND from '@/assets/Texas Bound.png';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import ButtonLists from '@/components/SelectorComponents/ButtonComponents/ButtonLists';
import { PASTHOMEPAGE, VOYAGESPAGE, VOYAGESTEXASPAGE } from '@/share/CONST_DATA';

const TexasBound: React.FC = () => {
    const lists = ['About', 'Database', 'Downloads', 'Contribute'];
    return (
        <div className="container-texas">
            <div className="texas-bound">
                <div className="texas-bound-detail">
                    <div>
                        <img src={TEXASBOUND} alt="logo" className="tx-img" />
                    </div>
                    <p>
                        Learn more about enslaved people who journeyed to Texas and the Gulf
                        Coast. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <ButtonLearnMore path={`${VOYAGESPAGE}${VOYAGESTEXASPAGE}#intro`} styleName='texas' />
                    <ButtonLists lists={lists} />
                </div>
                <div className="texas-bound-bg">
                    <img src={TEXAS} alt="logo" className="tx-img" />
                </div>
            </div>
        </div>
    );
};

export default TexasBound;
