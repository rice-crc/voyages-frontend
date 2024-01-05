import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

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
import defaultImage from '@/assets/no-imge-default.avif';

const BlogResultsList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    data: BlogData,
    searchAutoKey,
    searchAutoValue,
  } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );


  const [currentBlogPage, setCurrentBlogPage] = useState<number>(1);
  const imagesPerPage = 12
  const startIndex = (currentBlogPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const { language } = useSelector((state: RootState) => state.getLanguages);
  const [loading, setLoading] = useState(false);
  const imagesOnCurrentPage = BlogData.slice(startIndex, endIndex);
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const effectOnce = useRef(false);
  const fetchDataBlog = async () => {
    const dataSend: { [key: string]: (string | number)[] } = {
      language: [language],
      [searchAutoKey]: [searchAutoValue],
      global_search: [inputSearchValue],
    };
    try {
      const response = await dispatch(fetchBlogData(dataSend)).unwrap();

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

  useEffect(() => {
    if (!effectOnce.current) {
      fetchDataBlog();
    }
    return () => {
      dispatch(setBlogPost({} as BlogDataProps));
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
              {value.thumbnail ? (
                <img
                  src={`${BASEURL}${value.thumbnail}`}
                  alt={value.title}
                  className="card-img img-fluid content-image "
                />
              ) : (
                <img
                  src={defaultImage}
                  alt={value.title}
                  style={{ textAlign: 'center', width: '100%' }}
                />
              )}

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
