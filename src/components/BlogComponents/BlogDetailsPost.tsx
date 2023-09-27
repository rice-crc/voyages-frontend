import BlogCardHeaderBody from './BlogCardHeaderBody';
import '@/style/blogs.scss';
import { Divider } from '@mui/material';
import BlogCardContent from './BlogCardContent';
import HeaderLogoSearch from '../NavigationComponents/Header/HeaderSearchLogo';
import HeaderNavBarBlog from '../NavigationComponents/Header/HeaderNavBarBlog';

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
