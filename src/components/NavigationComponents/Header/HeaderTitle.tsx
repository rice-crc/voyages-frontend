import { usePageRouter } from '@/hooks/usePageRouter';
import { VOYAGEPATHENPOINT } from '@/share/CONST_DATA';
import { Link } from 'react-router-dom';
interface HeaderTitleProps {
  textHeader: string;
  HeaderTitle: string;
  pathLink: string;
  onClickReset: () => void;
}
export const HeaderTitle = (props: HeaderTitleProps) => {
  const { textHeader, HeaderTitle, pathLink, onClickReset } = props;
  const { styleName: styleNameRoute, endpointPath } = usePageRouter();

  return (
    <div className="enslaved-header-subtitle">
      <Link
        to={endpointPath !== VOYAGEPATHENPOINT ? `/${pathLink}` : ''}
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
