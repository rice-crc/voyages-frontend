import HeaderLogoSearch from '../header/HeaderSearchLogo';
import NavBlog from './NavBlog';
import { RootState } from '@/redux/store';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import '@/style/blogs.scss';

const BlogDetailsPost: React.FC = () => {
  const { blogTitle } = useParams();
  console.log('blogTitle', blogTitle);
  const { data: BlogData } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );

  return (
    <>
      <HeaderLogoSearch />
      <NavBlog />
      <div>Hellooo</div>
    </>
  );
};
export default BlogDetailsPost;
