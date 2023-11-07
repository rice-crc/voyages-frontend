import React from 'react';
import '@/style/intra-american.scss';
import INTRAMERCAN from '@/assets/Intra-American.svg';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import ButtonLists from '@/components/SelectorComponents/ButtonComponents/ButtonLists';
import { INTRAAMERICANPAGE, VOYAGESPAGE } from '@/share/CONST_DATA';

const IntraAmerican: React.FC = () => {
    const lists = ['About', 'Database', 'Downloads', 'Contribute'];
    return (
        <div className="container-intra-american">
            <div className="intra-american">
                <div className="intra-american-detail">
                    <h1>Intra-American</h1>
                    <p>
                        This database contains information on more than 11,000 maritime
                        voyages trafficking enslaved people within the Americas. These slave
                        trades operated within colonial empires, across imperial boundaries,
                        and inside the borders of nations such as the United States and
                        Brazil. Explore the forced removals, which not only dispersed
                        African survivors of the Atlantic crossing but also displaced
                        enslaved people born in the Americas.
                    </p>
                    <ButtonLearnMore path={`${VOYAGESPAGE}${INTRAAMERICANPAGE}#intro`} styleName='intra-american' />
                    <ButtonLists lists={lists} />
                </div>
                <div className="intra-american-bg">
                    <img src={INTRAMERCAN} alt="logo" className="intra-american-img" />
                </div>
            </div>
        </div>
    );
};

export default IntraAmerican;
