import React from 'react';
import HeaderLogoSearch from '../components/FunctionComponents/Header/HeaderSearchLogo';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
const DocumentPage: React.FC = () => {
  return (
    <>
      <HeaderLogoSearch />
      <div style={{ marginTop: '15%', textAlign: 'center' }}>
        <div>Document page is coming soon</div>
        <img
          src={LOADINGLOGO}
          alt="document"
          style={{ width: '30%', padding: '5%' }}
        />
      </div>
    </>
  );
};

export default DocumentPage;
