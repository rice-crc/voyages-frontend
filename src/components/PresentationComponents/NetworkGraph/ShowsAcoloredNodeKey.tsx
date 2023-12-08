import '@/style/networks.scss';
import { Divider } from '@mui/material';
const ShowsAcoloredNodeKey = () => {
  return (
    <div className="colored-box">
      <div className="div-box">
        <div className="circle voyages"></div>
        <p>Voyages</p>
      </div>
      <div className="div-box">
        <div className="circle enslavers"></div>
        <p>Enslavers</p>
      </div>
      <div className="div-box">
        <div className="circle enslaved"></div>
        <p>Enslaved People</p>
      </div>
      <div className="div-box">
        <div className="circle connection"></div>
        <p>Connections</p>
      </div>
      <Divider style={{ margin: 10 }} />
      <div className="div-box-line">
        <div className="line-edges captain"></div>
        <p>Captain</p>
      </div>
      <div className="div-box-line">
        <div className="line-edges owner"></div>
        <p>Owner</p>
      </div>
      <div className="div-box-line">
        < div className="line-edges shipper" ></div >
        <p>Shipper</p>
      </div >
      <div className=" div-box-line">
        < div className="line-edges consignor" ></div >
        <p>Consignor</p>
      </div >
      <div className=" div-box-line">
        < div className="line-edges shipper-consignor" ></div >
        <p>Consignor, Shipper</p>
      </div >
    </div >
  );
};
export default ShowsAcoloredNodeKey;
