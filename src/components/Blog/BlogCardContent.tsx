import ReactHtmlParser from 'react-html-parser';
import { RootState } from '@/redux/store';
import { BlogDataProps } from '@/share/InterfaceTypesBlog';
import { useSelector } from 'react-redux';

const BlogCardContent = () => {
  const post = useSelector(
    (state: RootState) => state.getBlogData.post as BlogDataProps
  );
  const { content } = post;

  return <div className="card-content-body">{ReactHtmlParser(content)}</div>;
};
export default BlogCardContent;
