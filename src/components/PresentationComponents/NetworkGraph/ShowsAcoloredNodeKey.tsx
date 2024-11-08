import {RootState} from '@/redux/store';
import '@/style/networks.scss';
import {translatedConnection} from '@/utils/functions/translationLanguages';
import {Divider} from '@mui/material';
import {useSelector} from 'react-redux';
const ShowsAcoloredNodeKey = () => {
  const {languageValue} = useSelector((state: RootState) => state.getLanguages);
  const translated = translatedConnection(languageValue);
  return (
    <div className="colored-box">
      <div className="div-box">
        <div className="circle voyages"></div>
        <p>{translated.voyages}</p>
      </div>
      <div className="div-box">
        <div className="circle enslavers"></div>
        <p>{translated.enslavers}</p>
      </div>
      <div className="div-box">
        <div className="circle enslaved"></div>
        <p>{translated.enslavedPeople}</p>
      </div>
      <div className="div-box">
        <div className="circle connection"></div>
        <p>{translated.connection}</p>
      </div>
      <Divider style={{margin: 10}} />
      <div className="div-box-line">
        <div className="line-edges captain"></div>
        <p>{translated.captain}</p>
      </div>
      <div className="div-box-line">
        <div className="line-edges owner"></div>
        <p>{translated.owner}</p>
      </div>
      <div className="div-box-line">
        < div className="line-edges shipper" ></div >
        <p>{translated.shipper}</p>
      </div >
      <div className=" div-box-line">
        < div className="line-edges consignor" ></div >
        <p>{translated.consignor}</p>
      </div >
      <div className=" div-box-line">
        < div className="line-edges shipper-consignor" ></div >
        <p>{translated.consignor}</p>
      </div >
    </div >
  );
};
export default ShowsAcoloredNodeKey;
