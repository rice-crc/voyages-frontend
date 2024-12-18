import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import '@/style/blogs.scss';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { Link } from 'react-router-dom';
import { BLOGPAGE } from '@/share/CONST_DATA';

const HeaderNavBarBlog: React.FC = () => {
  const { post } = useSelector(
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
          </Link>
        </div>
      </div>
    </>
  );
};
export default HeaderNavBarBlog;
//
