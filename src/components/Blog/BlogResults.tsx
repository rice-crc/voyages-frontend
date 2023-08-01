import { BlogData } from '@/utils/data/blogs';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeaderLogoSearch from '../header/HeaderSearchLogo';
import BlogPageButton from './PageButton';
import NavBlog from './NavBlog';
import { fetchBlogData } from '@/fetchAPI/blogApi/fetchBlogData';
import '@/style/blogs.scss';
import { AppDispatch, RootState } from '@/redux/store';
import { setBlogData } from '@/redux/getBlogDataSlice';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
const LinkThumbnil = 'https://www.slavevoyages.org/documents/';

const BlogResults: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const imagesPerPage = 12;
  const [currentBlogPage, setCurrentBlogPage] = useState<number>(1);
  // Calculate the index range for the images to display on the current page
  const startIndex = (currentBlogPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const { data: BlogData } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );

  // Extract the subset of images to display on the current page
  const imagesOnCurrentPage = BlogData.slice(startIndex, endIndex);
  useEffect(() => {
    let subscribed = true; //fetchBlogData
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
    };
  }, [dispatch]);
  function formatText(inputText: string) {
    return inputText
      .toLowerCase() // Convert the text to lowercase
      .replace(/[^\w\s]/g, '') // Remove all punctuation marks except spaces
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/\b\w\b/g, ''); // Remove single-letter words
  }
  const handleSetDataBlog = () => {};
  return (
    <>
      <HeaderLogoSearch />
      <NavBlog />
      <div className="container-new">
        <div className="card-columns">
          {imagesOnCurrentPage.map((value) => (
            <div
              className="card"
              key={`${value.id}${value.title}`}
              onClick={handleSetDataBlog}
            >
              <Link to={`/BlogPage/${formatText(value.title)}`}>
                <img
                  src={`${LinkThumbnil}${value.thumbnail}`}
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
export default BlogResults;
