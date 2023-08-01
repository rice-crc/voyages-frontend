import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import '@/style/blogs.scss';

const NavBlog: React.FC = () => {
  const { title } = useSelector((state: RootState) => state.getBlogData);

  return (
    <>
      <div className="nav-blog-header nav-blog-header-sticky ">
        <div>{`Echoes: The SlaveVoyages Blog - ${title}`}</div>
        <div className="navbar-blog-subtitle"></div>
      </div>
    </>
  );
};
export default NavBlog;
