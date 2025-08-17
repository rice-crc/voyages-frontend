import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import defaultImage from '@/assets/voyage-blog.png';
import NoDataState from '@/components/NoResultComponents/NoDataState';
import BlogPageButton from '@/components/SelectorComponents/ButtonComponents/BlogPageButton';
import { fetchBlogData } from '@/fetch/blogFetch/fetchBlogData';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setBlogData, setBlogPost } from '@/redux/getBlogDataSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { BASEURL } from '@/share/AUTH_BASEURL';
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
import '@/style/blogs.scss';
import { BLOGPAGE } from '@/share/CONST_DATA';

const IMAGES_PER_PAGE = 12;

const BlogResultsList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { blogURL } = usePageRouter();
  
  // Selectors
  const {
    data: BlogData,
    searchAutoKey,
    searchAutoValue,
  } = useSelector((state: RootState) => state.getBlogData as InitialStateBlogProps);
  
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);
  const { inputSearchValue } = useSelector((state: RootState) => state.getCommonGlobalSearch);
  
  // Local state
  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // Build filters based on current state
  const buildFilters = useCallback((): BlogFilter[] => {
    const filters: BlogFilter[] = [];
    
    // Add language filter if present
    if (languageValue) {
      filters.push({
        varName: 'language',
        searchTerm: [languageValue],
        op: 'in',
      });
    }
    
    // Add search filter based on priority: searchAutoValue > blogURL
    // If searchAutoValue exists (even if empty string), use it and ignore blogURL
    // If searchAutoValue is null/undefined, fall back to blogURL
    let searchTerm = null;
    
    if (searchAutoValue !== null && searchAutoValue !== undefined) {
      // searchAutoValue is explicitly set (could be empty string or non-empty)
      searchTerm = searchAutoValue.trim(); // Use trimmed value, empty string if originally empty
    } else if (blogURL) {
      // No searchAutoValue set, use blogURL as fallback
      searchTerm = reverseFormatTextURL(blogURL);
    }
    
    // Only add search filter if we have a non-empty search term and searchAutoKey
    if (searchTerm && searchAutoKey) {
      filters.push({
        varName: searchAutoKey,
        searchTerm: searchTerm,
        op: 'icontains',
      });
    }
    
    return filters;
  }, [languageValue, searchAutoValue, searchAutoKey, blogURL]);

  // Fetch blog data
  const fetchDataBlog = useCallback(async () => {
    setLoading(true);
    
    try {
      const filters = buildFilters();
      const dataSend: BlogDataPropsRequest = {
        filter: filters,
        page: page,
        page_size: IMAGES_PER_PAGE,
      };
      
      // Add global search if present
      if (inputSearchValue?.trim()) {
        dataSend.global_search = inputSearchValue.trim();
      }

      const response = await dispatch(fetchBlogData(dataSend)).unwrap();

      if (response) {
        const { results, count } = response;
        dispatch(setBlogData(results));
        setTotalResultsCount(Number(count) || 0);
      }
    } catch (error) {
      console.error('Failed to fetch blog data:', error);
      // Optionally dispatch an error action or show error state
      dispatch(setBlogData([]));
      setTotalResultsCount(0);
    } finally {
      setLoading(false);
    }
  }, [dispatch, buildFilters, page, inputSearchValue]);

  // Reset to first page when filters change
  const resetToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchDataBlog();
  }, [fetchDataBlog]);

  // Effect to reset page when filters change (but not page itself)
  useEffect(() => {
    resetToFirstPage();
  }, [languageValue, inputSearchValue, searchAutoKey, searchAutoValue, blogURL, resetToFirstPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(setBlogPost({} as BlogDataProps));
    };
  }, [dispatch]);

  // Render blog card
  const renderBlogCard = (blog: BlogDataProps) => (
    <div className="card" key={`${blog.id}-${blog.title}`}>
      <Link to={`/${BLOGPAGE}/${formatTextURL(blog.title)}/${blog.id}`}>
        <img
          src={blog.thumbnail ? `${BASEURL}${blog.thumbnail}` : defaultImage}
          alt={blog.title}
          className={blog.thumbnail ? "card-img img-fluid content-image" : ""}
          style={!blog.thumbnail ? { textAlign: 'center', width: '100%' } : undefined}
        />
        <div className="content-details fadeIn-bottom">
          <h3 className="content-title">{blog.title}</h3>
          {blog.subtitle && <h4 className="content-title">{blog.subtitle}</h4>}
          {blog.authors?.map((author, index) => (
            <p key={`${author.id}-${author.name}`}>
              {index > 0 && ' | '}
              {author.name}
            </p>
          ))}
        </div>
      </Link>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="loading-logo">
        <img src={LOADINGLOGO} alt="Loading..." />
      </div>
    );
  }

  const displayTitle = blogURL ? reverseFormatTextURL(blogURL) : '';
  const hasData = BlogData && BlogData.length > 0;

  return (
    <>
      {displayTitle && (
        <div id="blog_intro" className="blog_intro">
          <h2>{displayTitle}</h2>
        </div>
      )}
      
      {hasData ? (
        <div className={blogURL ? 'container-new-with-intro' : 'container-new'}>
          <div className="card-columns">
            {BlogData.map(renderBlogCard)}
          </div>
          
          <BlogPageButton
            setCurrentBlogPage={setPage}
            currentBlogPage={page}
            BlogData={BlogData}
            imagesPerPage={IMAGES_PER_PAGE}
            count={totalResultsCount}
          />
        </div>
      ) : (
        <NoDataState text={displayTitle || 'No blogs found'} />
      )}
    </>
  );
};

export default BlogResultsList;