import { fetchBlogData } from '@/fetch/blogFetch/fetchBlogData';
import { setBlogPost } from '@/redux/getBlogDataSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { BlogDataPropsRequest, BlogFilter, InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWhatsapp,
  faSquareFacebook,
  faTwitterSquare,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { faSquareEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { BASEURL } from '@/share/AUTH_BASEURL';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { convertToSlug } from '@/utils/functions/convertToSlug';

const BlogCardHeaderBody = () => {
  const { ID } = useParams();
  const dispatch: AppDispatch = useDispatch();

  const { post } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );

  const { title, thumbnail, authors, subtitle, tags, updated_on } = post;
  const effectOnce = useRef(false);
  const fetchDataBlog = async () => {
    const filters: BlogFilter[] = [];
    if ([parseInt(ID!)]) {
      filters.push({
        varName: "id",
        searchTerm: [parseInt(ID!)],
        "op": "in"
      })
    }
    const dataSend: BlogDataPropsRequest = {
      filter: filters,
    };

    try {
      const response = await dispatch(fetchBlogData(dataSend)).unwrap();
      if (response) {
        dispatch(setBlogPost(response.results?.[0]));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {

    if (!effectOnce.current) {
      fetchDataBlog();
    }

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

  return (
    <div className="card-body">
      <img
        className="blog-detail-thumbnail"
        src={`${BASEURL}${thumbnail ? thumbnail : ''}`}
        alt={title ? title : ''}
      />
      <h1 className="titleText">{title ? title : ''}</h1>
      <h3 className="subtitle">{subtitle ? subtitle : ''}</h3>
      <p className="card-text text-muted">{formattedDateTime}</p>
      {authors?.length > 0 &&
        authors?.map((author, index) => {
          return (
            <div className="media" key={`${author.id}-${index}`}>
              <div
                className="media-left media-top"
                key={`${index}-${author.photo || author.institution.image}`}
              >
                <Link
                  to={`/${BLOGPAGE}/author/${convertToSlug(author?.name)}/${author?.id
                    }/`}
                >
                  {author.photo ? (
                    <img
                      className="rounded-circle"
                      src={`${BASEURL}${author.photo}`}
                      width="40"
                      height="40"
                      alt={author.name}
                    />
                  ) : (
                    <div className="avatar">
                      <i className="fas fa-user fa-3x" aria-hidden="true"></i>
                    </div>
                  )}
                </Link>
              </div>
              <div className="media-body" key={`${index}-${author.name}`}>
                <h4 className="media-heading">
                  <Link
                    to={`/${BLOGPAGE}/author/${convertToSlug(author?.name)}/${author?.id
                      }/`}
                  >
                    {author.name}
                  </Link>
                </h4>
                {author.description}
              </div>
            </div>
          );
        })}
      <div className="tags-name-blog">
        {tags?.length > 0 &&
          tags?.map((tag, index) => (
            <div key={`${index}-${tag.slug}`} className="tags-name-list">
              <Link to={`/${BLOGPAGE}/tag/${tag.slug}/${tag.id}`}>
                <div className="badge badge-secondary">{tag.name}</div>
              </Link>
            </div>
          ))}
      </div>

      <div className="social">
        <a
          href="#"
          id="share-wa"
          data-sharer="whatsapp"
          className="icon-share"
          data-url="http://www.slavevoyages.org/blog/siblings"
        >
          <FontAwesomeIcon icon={faWhatsapp} size="lg" />
        </a>
        <a
          href="#"
          id="share-fb"
          data-sharer="facebook"
          className="icon-share"
          data-url="http://www.slavevoyages.org/blog/siblings"
        >
          <FontAwesomeIcon icon={faSquareFacebook} size="lg" />
        </a>
        <a
          href="#"
          id="share-tw"
          className="icon-share"
          data-sharer="twitter"
          data-url="http://www.slavevoyages.org/blog/siblings"
        >
          <FontAwesomeIcon icon={faTwitterSquare} size="lg" />
        </a>
        <a
          href="#"
          id="share-li"
          data-sharer="linkedin"
          className="icon-share"
          data-url="http://www.slavevoyages.org/blog/siblings"
        >
          <FontAwesomeIcon icon={faLinkedin} size="lg" />
        </a>
        <a
          href="#"
          id="share-em"
          data-sharer="email"
          className="icon-share"
          data-url="http://www.slavevoyages.org/blog/siblings"
        >
          <FontAwesomeIcon icon={faSquareEnvelope} size="lg" />
        </a>
      </div>
    </div>
  );
};
export default BlogCardHeaderBody;
