import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { fetchBlogData } from '@/fetch/blogFetch/fetchBlogData';
import { AppDispatch, RootState } from '@/redux/store';
import { setBlogData, setBlogPost } from '@/redux/getBlogDataSlice';
import {
  BlogDataProps,
  InitialStateBlogProps,
} from '@/share/InterfaceTypesBlog';
import { formatTextURL } from '@/utils/functions/formatText';
import { BASEURL } from '@/share/AUTH_BASEURL';
import '@/style/blogs.scss';
import { BLOGPAGE } from '@/share/CONST_DATA';
import BlogPageButton from '@/components/SelectorComponents/ButtonComponents/BlogPageButton';

const BlogResultsList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const imagesPerPage = 12;
  const [currentBlogPage, setCurrentBlogPage] = useState<number>(1);
  const startIndex = (currentBlogPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const {
    data: BlogData,
    searchAutoKey,
    searchAutoValue,
  } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );
  const { language } = useSelector((state: RootState) => state.getLanguages);
  const [loading, setLoading] = useState(false);
  const imagesOnCurrentPage = BlogData.slice(startIndex, endIndex);
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  useEffect(() => {
    let subscribed = true;
    const fetchDataBlog = async () => {
      const newFormData: FormData = new FormData();
      if (!inputSearchValue) {
        newFormData.append('language', language);
      }
      if (searchAutoValue) {
        newFormData.append(searchAutoKey, searchAutoValue);
      }
      if (inputSearchValue) {
        newFormData.append('global_search', String(inputSearchValue));
      }
      try {
        const response = await dispatch(fetchBlogData(newFormData)).unwrap();
        if (response) {
          dispatch(setBlogData(response));
          if (response.length <= 0) {
            setLoading(true);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        setLoading(false);
        console.log('error', error);
      }
    };
    fetchDataBlog();
    return () => {
      dispatch(setBlogPost({} as BlogDataProps));
      subscribed = false;
    };
  }, [dispatch, language, searchAutoValue, searchAutoKey, inputSearchValue]);

  return loading ? (
    <div className="loading-logo">
      <img src={LOADINGLOGO} />
    </div>
  ) : (
    <div className="container-new">
      <div className="card-columns">
        {imagesOnCurrentPage.map((value) => (
          <div className="card" key={`${value.id}${value.title}`}>
            <Link to={`/${BLOGPAGE}/${formatTextURL(value.title)}/${value.id}`}>
              <img
                src={`${BASEURL}${value.thumbnail}`}
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
  );
};
export default BlogResultsList;
