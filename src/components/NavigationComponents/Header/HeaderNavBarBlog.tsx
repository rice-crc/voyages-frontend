import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import '@/style/blogs.scss';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { Link, useParams } from 'react-router-dom';
import { BLOGPAGE } from '@/share/CONST_DATA';
import LanguagesDropdown from '../../SelectorComponents/DropDown/LanguagesDropdown';
import GlobalSearchButton from '../../PresentationComponents/GlobalSearch/GlobalSearchButton';
import AutoCompletedSearhBlog from '@/components/BlogComponents/AutoCompletedSearhBlog';

const HeaderNavBarBlog: React.FC = () => {
  const { blogTitle, institutionName } = useParams();
  const { post } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );
  const { title } = post;
  const handleReloadPage = () => {
    window.location.href = `/${BLOGPAGE}`;
  };
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  return (
    <>
      <div className="nav-blog-header nav-blog-header-sticky ">
        <div>
          <Link
            to={`/${BLOGPAGE}`}
            style={{ textDecoration: 'none', color: '#ffffff' }}
            onClick={handleReloadPage}
          >
            <div>{`Echoes: The SlaveVoyages Blog ${
              '-' && title ? title : ''
            }`}</div>
          </Link>
        </div>
        <div>
          {!blogTitle && !institutionName && <LanguagesDropdown />}
          <div className="search-autocomplete-blog">
            {inputSearchValue ? (
              <GlobalSearchButton />
            ) : (
              <AutoCompletedSearhBlog />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default HeaderNavBarBlog;
