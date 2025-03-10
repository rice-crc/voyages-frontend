interface HeaderTitleProps {
  textHeader: string;
}
export const HeaderTitle = (props: HeaderTitleProps) => {
  const { textHeader } = props;

  return (
    <div className="enslaved-header-subtitle">
      {textHeader && <span className="enslaved-title"></span>}
      <div>{textHeader}</div>
    </div>
  );
};
