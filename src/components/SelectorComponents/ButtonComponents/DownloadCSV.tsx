import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { usePageRouter } from '@/hooks/usePageRouter';
import { RootState } from '@/redux/store';
import {
  getColorBTNVoyageDatasetBackground,
  getColorBoxShadow,
  getColorHoverBackground
} from '@/utils/functions/getColorStyle';
import { useSelector } from 'react-redux';
import { translationHomepage } from '@/utils/functions/translationLanguages';
import { TableListPropsRequest } from '@/share/InterfaceTypes';
import { checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { downloadVoaygeCSV } from '@/fetch/voyagesFetch/downloadVoaygeCSV';

interface DownloadCSVProps {
  dataSend: TableListPropsRequest;
  styleNameRoute?:string
}

const DownloadCSV: React.FC<DownloadCSVProps> = ({ dataSend, styleNameRoute}) => {
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);
  const translatedHomepage = translationHomepage(languageValue);

  const downloadCSV = async () => {
    try {
      let response;
      if (checkPagesRouteForVoyages(styleNameRoute!)) {
        response = await downloadVoaygeCSV(dataSend); // Should return string
      }
      //  else if (checkPagesRouteForEnslaved(styleNameRoute!)) {
      //   response = await fetchEnslavedOptionsList(dataSend)
      // } else if (checkPagesRouteForEnslavers(styleNameRoute!)) {
      //   response = await fetchEnslaversOptionsList(dataSend)
      // }
      if (response) {
        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
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
  
  return (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <Button
        onClick={downloadCSV}
        endIcon={<DownloadIcon fontSize="small" />}
        sx={{
          fontSize: '0.80rem',
          textTransform: 'unset',
          backgroundColor: getColorBTNVoyageDatasetBackground(styleNameRoute!),
          boxShadow: getColorBoxShadow(styleNameRoute!),
          fontWeight: 600,
          color: '#ffffff',
          width: { xs: 120, sm: 120 },
          height: 28,
          '&:hover': {
            backgroundColor: getColorHoverBackground(styleNameRoute!),
          },
        }}
      >
        {translatedHomepage.downloanBTN}
      </Button>
    </span>
  );
};

export default DownloadCSV;
