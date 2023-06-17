import { fetchVoyageSortedData } from "@/fetchAPI/fetchVoyageSortedData";
import { setData } from "@/redux/getTableSlice";
import { AppDispatch } from "@/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import "@/style/table.scss";

interface Props {
  showColumnMenu: (ref: React.RefObject<HTMLDivElement> | null) => void;
  column: {
    colId: string;
    sort: string | null;
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

  const onSortRequested = (
    order: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setSort(order, event.shiftKey);
    onSortChanged();
  };

  const fetchData = async (sortOrder: string, colId: any) => {
    const newFormData: FormData = new FormData();
    if (sortOrder === "asc") {
      newFormData.append("order_by", colId);
    } else if (sortOrder === "desc") {
      newFormData.append("order_by", `-${colId}`);
    }
    try {
      const response = await dispatch(
        fetchVoyageSortedData(newFormData)
      ).unwrap();
      if (response) {
        dispatch(setData(response));
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  let isMounted = true;

  const onSortChanged = () => {
    if (isMounted) {
      console.log("column--", column);
      setAscSort(column.isSortAscending() ? "active" : "inactive");
      setDescSort(column.isSortDescending() ? "active" : "inactive");
      setNoSort(
        !column.isSortAscending() && !column.isSortDescending()
          ? "active"
          : "inactive"
      );
      const sortOrder = column.isSortAscending() ? "asc" : "desc";
      fetchData(sortOrder, column.colId);
    }
  };

  useEffect(() => {
    column.addEventListener("sortChanged", onSortChanged);
    return () => {
      isMounted = false;
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
  //

  let sort: React.ReactNode = null;
  if (enableSorting) {
    sort = (
      <div
        style={{
          display: "inline-block",
        }}
      >
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
      <div className="customHeaderLabel">{displayName}</div>
      {sort}
    </div>
  );
};

export default CustomHeader;
