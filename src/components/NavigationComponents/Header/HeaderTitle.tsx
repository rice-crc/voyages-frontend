import { Link } from 'react-router-dom';
interface HeaderTitleProps {
  textHeader: string;
  HeaderTitle: string;
  pathLink: string;
  onClickReset: () => void;
}
export const HeaderTitle = (props: HeaderTitleProps) => {
  const { textHeader, HeaderTitle, pathLink, onClickReset } = props;

  return (
    <div className="enslaved-header" style={{ color: '#000000' }}>
      <Link
        to={`/${pathLink}`}
        onClick={onClickReset}
        style={{
          textDecoration: 'none',
          color: '#ffffff',
        }}
      >
        {HeaderTitle}
      </Link>
      {textHeader && <span className="enslaved-title">:</span>}
      <div className="enslaved-header-subtitle">{textHeader}</div>
    </div>
  );
};
