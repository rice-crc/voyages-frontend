import HeaderLogoSearch from '../header/HeaderSearchLogo';
import NavBlog from './NavBlog';
import { AppDispatch, RootState } from '@/redux/store';
import { BlogDataProps } from '@/share/InterfaceTypesBlog';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import '@/style/blogs.scss';
import { fetchBlogData } from '@/fetchAPI/blogApi/fetchBlogData';
import { useEffect } from 'react';
import { setBlogPost } from '@/redux/getBlogDataSlice';
import { LinkThumbnail } from '@/share/CONST_DATA';

const BlogDetailsPost: React.FC = () => {
  const { ID } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const post = useSelector(
    (state: RootState) => state.getBlogData.post as BlogDataProps
  );

  console.log('post-->', post);
  const {
    title,
    thumbnail,
    authors,
    content,
    language,
    status,
    subtitle,
    tags,
    updated_on,
    created_on,
  } = post;

  useEffect(() => {
    let subscribed = true;
    const fetchDataBlog = async () => {
      const newFormData: FormData = new FormData();
      newFormData.append('id', String(ID));
      newFormData.append('id', String(ID));
      try {
        const response = await dispatch(fetchBlogData(newFormData)).unwrap();
        console.log('responst', response);
        if (subscribed && response) {
          dispatch(setBlogPost(response?.[0]));
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchDataBlog();
    return () => {
      subscribed = false;
    };
  }, [dispatch, ID]);
  const dateObj = updated_on ? new Date(updated_on) : new Date(updated_on);

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });

  const formattedDateTime = `${formattedDate}, ${formattedTime}`;
  const autherImage = authors ? authors[0]?.photo : '';
  const autherImageUrl = autherImage?.replace('/static', '');

  return (
    <>
      <HeaderLogoSearch />
      <NavBlog />
      <div className="container-new">
        <div className="row-next">
          <div className="card-content">
            <div className="card-body">
              <img
                className="blog-detail-thumbnail"
                src={`${LinkThumbnail}${thumbnail ? thumbnail : ''}`}
                alt={title ? title : ''}
              />
              <h1 className="titleText">{title ? title : ''}</h1>
              <h3 className="subtitle">{subtitle ? subtitle : ''}</h3>
              <p className="card-text text-muted h6">{formattedDateTime}</p>
              <div className="media ">
                <div className="media-left media-top">
                  <Link to="#">
                    <img
                      className="rounded-circle"
                      src={`${LinkThumbnail}${autherImageUrl}`}
                      width="40"
                      height="40"
                    />
                  </Link>
                </div>
                <div className="media-body">
                  <h4 className="media-heading">
                    <Link to="#">{authors ? authors[0]?.name : ''}</Link>
                  </h4>
                  Associate Professor
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogDetailsPost;
