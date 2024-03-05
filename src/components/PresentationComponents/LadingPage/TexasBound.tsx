import React from 'react';
import '@/style/texas-bound.scss';
import TEXAS from '@/assets/texasbound1.png';
import TEXASBOUND from '@/assets/Texas Bound.png';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import ButtonLists from '@/components/SelectorComponents/ButtonComponents/ButtonLists';
import { CONTRIBUTE, VOYAGESTEXASPAGE, TRANSATLANTICPAGE, VOYAGESPAGE, ABOUTPAGE, DOWNLOADS } from '@/share/CONST_DATA';

const TexasBound: React.FC = () => {
    const lists = [
        { name: 'About', url: `/${ABOUTPAGE}` },
        { name: 'Database', url: `${TRANSATLANTICPAGE}#voyages` },
        { name: 'Downloads', url: `${DOWNLOADS}` },
        { name: 'Contribute', url: `${CONTRIBUTE}` },
    ];
    return (
        <div className="container-texas">
            <div className="texas-bound">
                <div className="texas-bound-detail">
                    <div>
                        <img src={TEXASBOUND} alt="Texas Bound" className="tx-img" />
                    </div>
                    <p>
                        Learn more about enslaved people who journeyed to Texas and the Gulf
                        Coast. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <ButtonLearnMore path={`${VOYAGESTEXASPAGE}#voyages`} styleName='texas' />
                    <ButtonLists lists={lists} />
                </div>
                <div className="texas-bound-bg">
                    <img src={TEXAS} alt="Texas Bound" className="tx-img" />
                </div>
            </div>
        </div>
    );
};

export default TexasBound;
