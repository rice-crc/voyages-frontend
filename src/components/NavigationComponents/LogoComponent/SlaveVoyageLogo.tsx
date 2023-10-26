import voyageLogo from '@/assets/logo-voyage.svg';
import voyageText from '@/assets/slave-text.svg';

const SlaveVoyageLogo = () => {
  return (
    <div className="header-logo-slave-voyages">
      <div className="voyageLogo-img">
        <img src={voyageLogo} />
      </div>
      <div className="voyage-text-box">
        <div>
          <img src={voyageText} alt="voyageText" />
        </div>
        <div className="voyage-description">
          Explore the voyages that relocated more than 12 million enslaved Africans across the world
        </div>
      </div>
    </div>
  );
};
export default SlaveVoyageLogo;
