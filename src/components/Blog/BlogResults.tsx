import { BlogData } from '@/utils/data/blogs';
import '@/style/blogs.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import HeaderLogoSearch from '../header/HeaderSearchLogo';
import BlogPageButton from './PageButton';

const BlogResults: React.FC = () => {
  const imagesPerPage = 12;
  const [currentBlogPage, setCurrentBlogPage] = useState<number>(1);

  // Calculate the index range for the images to display on the current page
  const startIndex = (currentBlogPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  // Extract the subset of images to display on the current page
  const imagesOnCurrentPage = BlogData.slice(startIndex, endIndex);

  return (
    <>
      <HeaderLogoSearch />
      <div className="nav-blog-header nav-blog-header-sticky ">
        <div>Echoes: The SlaveVoyages Blog</div>
        <div className="navbar-blog-subtitle"></div>
      </div>
      <div className="container-new">
        <div className="card-columns">
          {imagesOnCurrentPage.map((value) => (
            <div className="card" key={`${value.id}${value.alt}`}>
              {/* <Link to={value.link}> */}
              <img
                src={value.img}
                alt={value.alt}
                className="card-img img-fluid content-image "
              />
              <div className="content-details fadeIn-bottom">
                <h3 className="content-title">{value.contentTitleH3}</h3>
                <h4 className="content-title">{value.contentTitleH4}</h4>
                <p className="content-text">{value.contentText}</p>
              </div>
              {/* </Link> */}
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
