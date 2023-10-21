import React from 'react';
import '@/style/landing.scss';
import TRANSATLANTIC from '@/assets/transAtlantic.svg';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import ButtonLists from '@/components/SelectorComponents/ButtonComponents/ButtonLists';
const TransAtlantic: React.FC = () => {
    const lists = [
        'About',
        'Database',
        'Estimates',
        'Essays',
        'Downloads',
        'Contribute',
    ];
    return (
        <div className="container-african">
            <div className="african-content">
                <div className="atlatic-content-bg">
                    <img
                        src={TRANSATLANTIC}
                        alt="AFRICANORIGINS"
                        className="african-img"
                    />
                </div>
                <div className="african-content-detail">
                    <h1>Trans-Atlantic</h1>
                    <p>
                        This database compiles information about more than 36,000 voyages
                        that forcibly transported enslaved Africans across the Atlantic
                        between 1514 and 1866. Search and analyze the database for
                        information on the broad origins of enslaved people, the tortuous
                        Middle Passage, and the destinations of Africans in the Americas.
                    </p>
                    <ButtonLearnMore />
                    <ButtonLists lists={lists} />
                </div>
            </div>
        </div>
    );
};

export default TransAtlantic;
