import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import '@/style/blogs.scss';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { Link } from 'react-router-dom';
import { BLOGPAGE } from '@/share/CONST_DATA';
import LanguagesDropdown from '../FunctionComponents/LanguagesDropdown';
import SelectSearchBlogDropdown from './SelectSearchBlogDropdown';
import AutoCompletedSearhBlog from './AutoCompletedSearhBlog';

const NavBlog: React.FC = () => {
  const { post, searchValue, searchTitle } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );
  const { title, subtitle } = post;

  return (
    <>
      <div className="nav-blog-header nav-blog-header-sticky ">
        <div>
          <Link
            to={`/${BLOGPAGE}`}
            style={{ textDecoration: 'none', color: '#ffffff' }}
          >
            <div>{`Echoes: The SlaveVoyages Blog ${
              '-' && title ? title : ''
            }`}</div>
            {/* WAIT TO DISPLAY Auto Title from user select 
            <div className="navbar-blog-subtitle">{subtitle ? subtitle : ''}</div> */}
            <div className="navbar-blog-subtitle">
              {subtitle ? 'all post' : ''}
            </div>
          </Link>
        </div>
        <div>
          <LanguagesDropdown />
          <div className="search-autocomplete-blog">
            <SelectSearchBlogDropdown />
            {}
            <AutoCompletedSearhBlog />
          </div>
        </div>
      </div>
    </>
  );
};
export default NavBlog;
