import '@/style/blogs.scss';
import { Divider } from '@mui/material';
import { useSelector } from 'react-redux';

import MetaTag from '@/components/MetaTag/MetaTag';
import HeaderNavBarBlog from '@/components/NavigationComponents/Header/HeaderNavBarBlog';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import { RootState } from '@/redux/store';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';

import BlogCardContent from './BlogCardContent';
import BlogCardHeaderBody from './BlogCardHeaderBody';

const BlogDetailsPost: React.FC = () => {
  const { post } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps,
  );
  const pageTitle = post?.title || 'Blog - Slave Voyages';
  const pageDescription =
    'Explore the lives, journeys, and stories of the people affecte';
  return (
    <div className="blog-container">
      <MetaTag pageDescription={pageDescription} pageTitle={pageTitle} />
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
    </div>
  );
};
export default BlogDetailsPost;
