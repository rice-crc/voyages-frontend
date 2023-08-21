import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import '@/style/blogs.scss';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { Link, useParams } from 'react-router-dom';
import { BLOGPAGE } from '@/share/CONST_DATA';
import LanguagesDropdown from '../FunctionComponents/LanguagesDropdown';
import AutoCompletedSearhBlog from './AutoCompletedSearhBlog';

const NavBarBlog: React.FC = () => {
  const { blogTitle, institutionName } = useParams();
  const { post, searchTitle } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );
  const { title } = post;
  const handleReloadPage = () => {
    window.location.href = `/${BLOGPAGE}`;
  };

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
            <div className="navbar-blog-subtitle">
              {searchTitle ? searchTitle.toUpperCase() : ''}
            </div>
          </Link>
        </div>
        <div>
          {!blogTitle && !institutionName && <LanguagesDropdown />}
          <div className="search-autocomplete-blog">
            <AutoCompletedSearhBlog />
          </div>
        </div>
      </div>
    </>
  );
};
export default NavBarBlog;
