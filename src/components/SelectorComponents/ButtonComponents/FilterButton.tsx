import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useDispatch, useSelector } from 'react-redux';

import { setIsFilter } from '@/redux/getFilterSlice';
import { AppDispatch, RootState } from '@/redux/store';

export const FilterButton = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const handleClick = () => {
    dispatch(setIsFilter(!isFilter));
  };

  return (
    <span style={{ cursor: 'pointer', display: 'flex' }} onClick={handleClick}>
      <FilterAltIcon style={{ color: '#fff' }} />
      <div className="menu-nav-bar"> Filter Search</div>
    </span>
  );
};
