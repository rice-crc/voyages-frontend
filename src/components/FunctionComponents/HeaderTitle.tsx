import { Link } from 'react-router-dom';
export const HeaderTitle = ({
  textHeader,
  HeaderTitle,
}: {
  textHeader: string;
  HeaderTitle: string;
}) => {
  return (
    <div className="enslaved-header" style={{ color: '#000000' }}>
      <Link
        to="/PastHomePage"
        style={{
          textDecoration: 'none',
          color: textHeader ? '#000000' : '#ffffff',
        }}
      >
        {HeaderTitle}
      </Link>
      {textHeader && <span className="enslaved-title">:</span>}
      <div className="enslaved-header-subtitle">{textHeader}</div>
    </div>
  );
};
