import HeaderLogoSearch from '../FunctionComponents/Header/HeaderSearchLogo';
import HeaderNavBarBlog from '../FunctionComponents/Header/HeaderNavBarBlog';
import BlogCardHeaderBody from './BlogCardHeaderBody';
import '@/style/blogs.scss';
import { Divider } from '@mui/material';
import BlogCardContent from './BlogCardContent';

const BlogDetailsPost: React.FC = () => {
  return (
    <>
      <HeaderLogoSearch />
      <HeaderNavBarBlog />
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
