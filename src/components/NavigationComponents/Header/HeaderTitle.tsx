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
    <div className="enslaved-header-subtitle">
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
      {textHeader && <span className="enslaved-title">-</span>}
      <div >{textHeader}</div>
    </div>
  );
};
