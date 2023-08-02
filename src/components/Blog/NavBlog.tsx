import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import '@/style/blogs.scss';
import { BlogDataProps } from '@/share/InterfaceTypesBlog';
import { Link } from 'react-router-dom';
import { BLOGPAGE } from '@/share/CONST_DATA';

const NavBlog: React.FC = () => {
  const post = useSelector(
    (state: RootState) => state.getBlogData.post as BlogDataProps
  );
  const { title, subtitle } = post;

  return (
    <>
      <div className="nav-blog-header nav-blog-header-sticky ">
        <Link
          to={`/${BLOGPAGE}`}
          style={{ textDecoration: 'none', color: '#ffffff' }}
        >
          <div>{`Echoes: The SlaveVoyages Blog ${
            '-' && title ? title : ''
          }`}</div>
        </Link>
        <div className="navbar-blog-subtitle">{subtitle ? 'all post' : ''}</div>
        {/* WAIT TO DISPLAY Auto Title from user select */}
        {/* <div className="navbar-blog-subtitle">{subtitle ? subtitle : ''}</div> */}
      </div>
    </>
  );
};
export default NavBlog;
