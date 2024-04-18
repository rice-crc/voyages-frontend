import { usePageRouter } from '@/hooks/usePageRouter';
import { Link } from 'react-router-dom';
import { VOYAGEPATHENPOINT } from '@/share/CONST_DATA';
interface HeaderTitleProps {
  HeaderTitle: string
  pathLink: string;
  onClickReset: () => void;
  textHeader: string
}
export const HeaderTitle = (props: HeaderTitleProps) => {
  const { HeaderTitle, pathLink, textHeader, onClickReset } = props;
  const { styleName: endpointPath } = usePageRouter();

  return (
    <div className="enslaved-header-subtitle">
      <Link
        to={endpointPath !== VOYAGEPATHENPOINT ? `${pathLink}` : ''}
        onClick={onClickReset}
        style={{
          textDecoration: 'none',
          color: '#ffffff',
        }}
      >
        {HeaderTitle}
      </Link>
      {textHeader && <span className="enslaved-title">:</span>}
      <div >{textHeader}</div>
    </div>
  );
};
