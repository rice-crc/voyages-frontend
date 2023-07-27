import { setPathName } from '@/redux/getDataSetCollectionSlice';
import { setIsFilter } from '@/redux/getFilterSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface FilterButtonProps {
  pathName: string;
  currentPage: number;
}
export const FilterButton = ({ pathName, currentPage }: FilterButtonProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const handleClick = () => {
    dispatch(setIsFilter(!isFilter));
    dispatch(setPathName(pathName));
  };

  return (
    currentPage !== 1 && (
      <span
        style={{ cursor: 'pointer', display: 'flex' }}
        onClick={handleClick}
      >
        <FilterAltIcon style={{ color: '#000000' }} />
        <div className="menu-nav-bar"> Filter Search</div>
      </span>
    )
  );
};
