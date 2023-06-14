import { fetchVoyageSortedData } from "@/fetchAPI/fetchVoyageSortedData";
import { setRowData } from "@/redux/getTableSlice";
import { AppDispatch } from "@/redux/store";
import { RowData } from "@/share/InterfaceTypesTable";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

interface Props {
  showColumnMenu: (ref: React.RefObject<HTMLDivElement> | null) => void;
  column: {
    isSortAscending: () => boolean;
    isSortDescending: () => boolean;
    addEventListener: (event: string, callback: () => void) => void;
  };
  setSort: (order: string, shiftKey: boolean) => void;
  enableMenu: boolean;
  menuIcon: string;
  enableSorting: boolean;
  displayName: string;
}

const CustomHeader: React.FC<Props> = (props) => {
  const {
    showColumnMenu,
    column,
    setSort,
    enableMenu,
    menuIcon,
    enableSorting,
    displayName,
  } = props;
  const dispatch: AppDispatch = useDispatch();
  const [ascSort, setAscSort] = useState<string>("inactive");
  const [descSort, setDescSort] = useState<string>("inactive");
  const [noSort, setNoSort] = useState<string>("inactive");
  const refButton = useRef<HTMLDivElement>(null);
  const onMenuClicked = () => {
    showColumnMenu(refButton);
  };

  const onSortChanged = () => {
    setAscSort(column.isSortAscending() ? "active" : "inactive");
    setDescSort(column.isSortDescending() ? "active" : "inactive");
    setNoSort(
      !column.isSortAscending() && !column.isSortDescending()
        ? "active"
        : "inactive"
    );
  };

  const onSortRequested = (
    order: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setSort(order, event.shiftKey);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async (sortOrder: string) => {
      console.log("sortOrder", sortOrder);
      const newFormData: FormData = new FormData();
      if (sortOrder === "ascending") {
        newFormData.append(
          "order_by",
          "voyage_slaves_numbers__imp_total_num_slaves_embarked"
        );
      } else if (sortOrder === "descending") {
        newFormData.append(
          "order_by",
          "-voyage_slaves_numbers__imp_total_num_slaves_embarked"
        );
      }

      try {
        const response = await dispatch(
          fetchVoyageSortedData(newFormData)
        ).unwrap();
        if (response) {
          console.log("response", response);
          // dispatch(setRowData(response));
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    const onSortChanged = () => {
      if (isMounted) {
        setAscSort(column.isSortAscending() ? "active" : "inactive");
        setDescSort(column.isSortDescending() ? "active" : "inactive");
        setNoSort(
          !column.isSortAscending() && !column.isSortDescending()
            ? "active"
            : "inactive"
        );

        const sortOrder = column.isSortAscending() ? "ascending" : "descending";
        fetchData(sortOrder);
      }
    };

    column.addEventListener("sortChanged", onSortChanged);
    onSortChanged();

    // Clean up the event listener and set mounted flag to false when the component unmounts
    return () => {
      isMounted = false;
      // You may need to remove the event listener here if it's supported by your specific implementation
    };
  }, []);

  let menu: React.ReactNode = null;
  if (enableMenu) {
    menu = (
      <div
        ref={refButton}
        className="customHeaderMenuButton"
        onClick={() => onMenuClicked()}
      >
        <i className={`fa ${menuIcon}`}></i>
      </div>
    );
  }

  let sort: React.ReactNode = null;
  if (enableSorting) {
    sort = (
      <div style={{ display: "inline-block" }}>
        <div
          onClick={(event) => onSortRequested("asc", event)}
          onTouchEnd={(event) => onSortRequested("asc", event)}
          className={`customSortDownLabel ${ascSort}`}
        >
          <i className="fa fa-long-arrow-alt-down"></i>
        </div>
        <div
          onClick={(event) => onSortRequested("desc", event)}
          onTouchEnd={(event) => onSortRequested("desc", event)}
          className={`customSortUpLabel ${descSort}`}
        >
          <i className="fa fa-long-arrow-alt-up"></i>
        </div>
        <div
          onClick={(event) => onSortRequested("", event)}
          onTouchEnd={(event) => onSortRequested("", event)}
          className={`customSortRemoveLabel ${noSort}`}
        >
          <i className="fa fa-times"></i>
        </div>
      </div>
    );
  }

  return (
    <div>
      {menu}
      <div className="customHeaderLabel">{displayName}</div>
      {sort}
    </div>
  );
};

export default CustomHeader;
