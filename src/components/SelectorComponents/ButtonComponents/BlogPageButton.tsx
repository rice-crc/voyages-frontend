import { Link } from 'react-router-dom';

import { BlogDataProps } from '@/share/InterfaceTypesBlog';

interface PageButtonBlogProp {
  setCurrentBlogPage: React.Dispatch<React.SetStateAction<number>>;
  currentBlogPage: number;
  imagesPerPage: number;
  BlogData: BlogDataProps[];
  count: number;
}
const BlogPageButton = (props: PageButtonBlogProp) => {
  const { setCurrentBlogPage, currentBlogPage, imagesPerPage, count } = props;
  return (
    <div className="row-next">
      <div className="col-pagination">
        <nav aria-label="Page navigation container">
          <div className="dataTables_paginate paging_simple_numbers">
            Page {currentBlogPage} of {Math.ceil(count / imagesPerPage)}.
            <ul className="pagination pagination-sm justify-content-center">
              <li>
                {currentBlogPage > 1 && (
                  <Link to={`?page=${1}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentBlogPage(1)}
                    >
                      « First
                    </button>
                  </Link>
                )}
              </li>
              <li>
                {currentBlogPage > 1 && (
                  <Link to={`?page=${currentBlogPage - 1}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentBlogPage(currentBlogPage - 1)}
                    >
                      Previous
                    </button>
                  </Link>
                )}
              </li>
              <li>
                {currentBlogPage < Math.ceil(count / imagesPerPage) && (
                  <Link to={`?page=${currentBlogPage + 1}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentBlogPage(currentBlogPage + 1)}
                    >
                      Next
                    </button>
                  </Link>
                )}
              </li>
              {currentBlogPage < Math.ceil(count / imagesPerPage) && (
                <li>
                  <Link to={`?page=${Math.ceil(count / imagesPerPage)}`}>
                    <button
                      className="page-link"
                      onClick={() =>
                        setCurrentBlogPage(Math.ceil(count / imagesPerPage))
                      }
                    >
                      Last »
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};
export default BlogPageButton;
