import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { fetchBlogData } from '@/fetch/blogFetch/fetchBlogData';
import { AppDispatch, RootState } from '@/redux/store';
import { setBlogData, setBlogPost } from '@/redux/getBlogDataSlice';
import {
  BlogDataProps,
  BlogDataPropsRequest,
  BlogFilter,
  InitialStateBlogProps,
} from '@/share/InterfaceTypesBlog';
import {
  formatTextURL,
  reverseFormatTextURL,
} from '@/utils/functions/formatText';
import { BASEURL } from '@/share/AUTH_BASEURL';
import '@/style/blogs.scss';
import { BLOGPAGE } from '@/share/CONST_DATA';
import BlogPageButton from '@/components/SelectorComponents/ButtonComponents/BlogPageButton';
import defaultImage from '@/assets/voyage-blog.png';
import { usePageRouter } from '@/hooks/usePageRouter';

const BlogResultsList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { blogURL } = usePageRouter();
  const {
    data: BlogData,
    searchAutoKey,
    searchAutoValue,
  } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );
  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [page, setPage] = useState<number>(1);

  const imagesPerPage = 12;
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);
  const [loading, setLoading] = useState(false);
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  const effectOnce = useRef(false);
  const fetchDataBlog = async () => {
    const filters: BlogFilter[] = [];
    if (languageValue) {
      filters.push({
        varName: 'language',
        searchTerm: [languageValue],
        op: 'in',
      });
    }
    if (searchAutoValue || blogURL) {
      const convertURL = reverseFormatTextURL(blogURL!);
      filters.push({
        varName: searchAutoKey,
        searchTerm: [searchAutoValue || convertURL!],
        op: 'in',
      });
    }

    const dataSend: BlogDataPropsRequest = {
      filter: filters,
      page: page,
      page_size: imagesPerPage,
    };

    if (inputSearchValue) {
      dataSend['global_search'] = inputSearchValue;
    }

    try {
      const response = await dispatch(fetchBlogData(dataSend)).unwrap();

      if (response) {
        const { results, count } = response;
        dispatch(setBlogData(results));
        setTotalResultsCount(() => Number(count));
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
  }, [
    dispatch,
    languageValue,
    inputSearchValue,
    page,
    searchAutoKey,
    searchAutoValue,
  ]);

  return loading ? (
    <div className="loading-logo">
      <img src={LOADINGLOGO} />
    </div>
  ) : (
    <>
      <div id="blog_intro" className="blog_intro">
        <h2>{reverseFormatTextURL(blogURL!)}</h2>
      </div>
      {BlogData.length === 0 ? (
        <div className="loading-logo">
          <img src={LOADINGLOGO} />
        </div>
      ) : (
        <div className={blogURL ? 'container-new-with-intro' : 'container-new'}>
          <div className="card-columns">
            {BlogData.map((value) => (
              <div className="card" key={`${value.id}${value.title}`}>
                <Link
                  to={`/${BLOGPAGE}/${formatTextURL(value.title)}/${value.id}`}
                >
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
            setCurrentBlogPage={setPage}
            currentBlogPage={page}
            BlogData={BlogData}
            imagesPerPage={imagesPerPage}
            count={totalResultsCount}
          />
        </div>
      )}
    </>
  );
};
export default BlogResultsList;
