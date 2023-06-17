import React, { FC, ReactNode } from "react";

interface Props {
  rowIndex?: number;
  colDef: {
    children: { headerName: string }[];
  };
  value: {
    value?: ReactNode | string;
  };
}

const CustomTooltip: FC<Props> = (props) => {
  const { rowIndex, value, colDef } = props;
  const isHeader = rowIndex === undefined;
  const isGroupedHeader = isHeader && !!colDef.children;
  const valueToDisplay = value.value ? value.value : "- Missing -";

  return isHeader ? (
    <div className="custom-tooltip">
      <p>Group Name: {value ? "" : ""}</p>
      {isGroupedHeader ? <hr /> : null}
      {isGroupedHeader
        ? colDef.children.map(function (header, idx) {
            return (
              <p key={idx}>
                Child {idx + 1} - {header.headerName}
              </p>
            );
          })
        : null}
    </div>
  ) : (
    <div className="custom-tooltip">
      <p>
        <span>Athlete's Name:</span>
      </p>
      <p>
        <span>{valueToDisplay}</span>
      </p>
    </div>
  );
};

export default CustomTooltip;
