import { setInputSearchValue } from '@/redux/getCommonGlobalSearchResultSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import '@/style/homepage.scss';

const GlobalSearchButton = () => {
  const dispatch: AppDispatch = useDispatch();
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      const { filterObject } = parsedValue;
      const { global_search } = filterObject;
      if (global_search) {
        dispatch(setInputSearchValue(global_search));
      }
    }
  }, []);

  const handleExitGlobalSearch = () => {
    dispatch(setInputSearchValue(''));
    // Retrieve the filterObject from localStorage
    const filterObjectString = localStorage.getItem('filterObject');

    if (filterObjectString) {
      // Parse the JSON string into an object
      const filterObject = JSON.parse(filterObjectString);

      // Remove the "global_search" key from the filterObject
      delete filterObject.filterObject['global_search'];

      // Convert the updated filterObject back to a string
      const updatedFilterObjectString = JSON.stringify(filterObject);

      // Store the updated filterObject back into localStorage
      localStorage.setItem('filterObject', updatedFilterObjectString);
    }
  };
  return (
    <span className="global-search-button">
      <span className="global-search-text">
        Global Search Active: "{inputSearchValue}"
      </span>
      <span className="global-search-exit" onClick={handleExitGlobalSearch}>
        <ExitToAppIcon />
        "Exit global search"
      </span>
    </span>
  );
};
export default GlobalSearchButton;
