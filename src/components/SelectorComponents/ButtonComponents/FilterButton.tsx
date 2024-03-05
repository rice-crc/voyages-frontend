import { setIsFilter } from '@/redux/getFilterSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface FilterButtonProps {
  pathName: string;
  currentPageBlockName?: string
  currentPage?: number;
}
export const FilterButton = ({ currentPageBlockName, currentPage }: FilterButtonProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const handleClick = () => {
    dispatch(setIsFilter(!isFilter));
  };

  return (
    <span
      style={{ cursor: 'pointer', display: 'flex' }}
      onClick={handleClick}
    >
      <FilterAltIcon style={{ color: '#fff' }} />
      <div className="menu-nav-bar"> Filter Search</div>
    </span>

  );
};
