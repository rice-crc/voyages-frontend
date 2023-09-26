import '@/style/networks.scss';
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
    </div>
  );
};
export default ShowsAcoloredNodeKey;
