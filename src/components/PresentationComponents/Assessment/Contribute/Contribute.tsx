import HeaderLogoSearch from "@/components/NavigationComponents/Header/HeaderSearchLogo";
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import React from 'react';

const Contribute: React.FC = () => {
    return (
        <>
            <div style={{ marginTop: '15%', textAlign: 'center' }}>
                <div>Contribute page is coming soon</div>
                <img
                    src={LOADINGLOGO}
                    alt="document"
                    style={{ width: '30%', padding: '5%' }}
                />
            </div>
        </>
    )
}

export default Contribute;