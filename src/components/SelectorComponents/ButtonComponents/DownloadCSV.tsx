import React from 'react';

import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

import { downloadVoaygeCSV } from '@/fetch/voyagesFetch/downloadVoaygeCSV';
import { RootState } from '@/redux/store';
import { TableListPropsRequest } from '@/share/InterfaceTypes';
import { checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import {
  getColorBTNVoyageDatasetBackground,
  getColorBoxShadow,
  getColorHoverBackground,
} from '@/utils/functions/getColorStyle';
import { translationHomepage } from '@/utils/functions/translationLanguages';

interface DownloadCSVProps {
  dataSend: TableListPropsRequest;
  styleNameRoute?: string;
}

const DownloadCSV: React.FC<DownloadCSVProps> = ({
  dataSend,
  styleNameRoute,
}) => {
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const translatedHomepage = translationHomepage(languageValue);

  const downloadCSV = async () => {
    try {
      let response;
      if (checkPagesRouteForVoyages(styleNameRoute!)) {
        response = await downloadVoaygeCSV(dataSend); // Should return string
      }
      /** 
       *  TODO: Uncomment this once we can use the new API with Both Enslaved and Enslavers
        else if (checkPagesRouteForEnslaved(styleNameRoute!)) {
       response = await fetchEnslavedOptionsList(dataSend)
       } else if (checkPagesRouteForEnslavers(styleNameRoute!)) {
       response = await fetchEnslaversOptionsList(dataSend)
        }
       */

      if (response) {
        const blob = new Blob([response.data], {
          type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${styleNameRoute}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  // Base button styles
  const baseButtonStyle = {
    fontSize: '0.80rem',
    textTransform: 'unset' as const,
    backgroundColor: getColorBTNVoyageDatasetBackground(styleNameRoute!),
    boxShadow: getColorBoxShadow(styleNameRoute!),
    fontWeight: 600,
    color: '#ffffff',
    width: window.innerWidth < 600 ? 120 : 120, // Responsive width
    height: '28px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  // Event handlers for hover effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = getColorHoverBackground(styleNameRoute!);
    target.style.color = '#ffffff';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = getColorBTNVoyageDatasetBackground(
      styleNameRoute!,
    );
    target.style.color = '#ffffff';
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = getColorHoverBackground(styleNameRoute!);
    target.style.color = '#ffffff';
    target.style.outline = 'none';
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = getColorBTNVoyageDatasetBackground(
      styleNameRoute!,
    );
    target.style.color = '#ffffff';
  };

  return (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <Button
        onClick={downloadCSV}
        style={baseButtonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {translatedHomepage.downloanBTN}
        <DownloadOutlined style={{ fontSize: '14px' }} />
      </Button>
    </span>
  );
};

export default DownloadCSV;
