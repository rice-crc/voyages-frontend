import HeaderLogoSearch from '../header/HeaderSearchLogo';
import NavBlog from './NavBarBlog';
import BlogCardHeaderBody from './BlogCardHeaderBody';
import '@/style/blogs.scss';
import { Divider } from '@mui/material';
import BlogCardContent from './BlogCardContent';

const BlogDetailsPost: React.FC = () => {
  return (
    <>
      <HeaderLogoSearch />
      <NavBlog />
      <div className="container-new">
        <div className="row-next">
          <div className="card-content">
            <BlogCardHeaderBody />
            <Divider />
            <BlogCardContent />
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogDetailsPost;
