import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeaderLogoSearch from '../header/HeaderSearchLogo';
import BlogPageButton from './PageButton';
import NavBlog from './NavBlog';
import { fetchBlogData } from '@/fetchAPI/blogApi/fetchBlogData';
import { AppDispatch, RootState } from '@/redux/store';
import { setBlogData, setBlogPost } from '@/redux/getBlogDataSlice';
import {
  BlogDataProps,
  InitialStateBlogProps,
} from '@/share/InterfaceTypesBlog';
import { formatTextURL } from '@/utils/functions/formatText';
import { BASTURLBLOG } from '@/share/AUTH_BASEURL';
import '@/style/blogs.scss';

const BlogResultsList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const imagesPerPage = 12;
  const [currentBlogPage, setCurrentBlogPage] = useState<number>(1);
  const startIndex = (currentBlogPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const { data: BlogData, post } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );

  const imagesOnCurrentPage = BlogData.slice(startIndex, endIndex);

  useEffect(() => {
    let subscribed = true;
    const fetchDataBlog = async () => {
      const newFormData: FormData = new FormData();
      try {
        const response = await dispatch(fetchBlogData(newFormData)).unwrap();

        if (response) {
          dispatch(setBlogData(response));
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchDataBlog();
    return () => {
      subscribed = false;
      dispatch(setBlogPost({} as BlogDataProps));
    };
  }, [dispatch]);

  return (
    <>
      <HeaderLogoSearch />
      <NavBlog />
      <div className="container-new">
        <div className="card-columns">
          {imagesOnCurrentPage.map((value) => (
            <div className="card" key={`${value.id}${value.title}`}>
              <Link to={`/BlogPage/${formatTextURL(value.title)}/${value.id}`}>
                <img
                  src={`${BASTURLBLOG}${value.thumbnail}`}
                  alt={value.title}
                  className="card-img img-fluid content-image "
                />
                <div className="content-details fadeIn-bottom">
                  <h3 className="content-title">{value.title}</h3>

                  <h4 className="content-title">{value.subtitle}</h4>
                  {value.authors.map((name, index) => (
                    <p key={`${name.id}${name.name}`}>
                      {index > 0 && ' | '}
                      {name.name}
                    </p>
                  ))}
                </div>
              </Link>
            </div>
          ))}
        </div>
        <BlogPageButton
          setCurrentBlogPage={setCurrentBlogPage}
          currentBlogPage={currentBlogPage}
          BlogData={BlogData}
          imagesPerPage={imagesPerPage}
        />
      </div>
    </>
  );
};
export default BlogResultsList;
