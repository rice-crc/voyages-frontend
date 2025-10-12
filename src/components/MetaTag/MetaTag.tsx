import { FunctionComponent } from 'react';

import { Helmet } from 'react-helmet-async';

interface MetaTagProps {
  pageTitle: string;
  pageDescription: string;
}
const MetaTag: FunctionComponent<MetaTagProps> = ({
  pageTitle = 'Slave Voyages',
  pageDescription,
}) => {
  return (
    <Helmet defer={false}>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <link
        rel="canonical"
        href={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default MetaTag;
