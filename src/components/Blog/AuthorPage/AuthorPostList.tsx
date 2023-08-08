import { RootState } from '@/redux/store';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { useSelector } from 'react-redux';
import { BASTURLBLOG } from '@/share/AUTH_BASEURL';
import { formatTextURL } from '@/utils/functions/formatText';
import { Link } from 'react-router-dom';
import '@/style/blogs.scss';

const AuthorPostList: React.FC = () => {
  const { authorPost } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );
  const { language: Lang } = useSelector(
    (state: RootState) => state.getLanguages
  );

  const displayListPost = authorPost.map((value) => {
    const { id, title, thumbnail, subtitle, language } = value;
    return (
      <div className="card" key={`${id}${title}`}>
        <Link to={`/BlogPage/${formatTextURL(title)}/${id}`}>
          {language === Lang && (
            <img
              src={`${BASTURLBLOG}${thumbnail}`}
              alt={title}
              className="card-img img-fluid content-image "
            />
          )}
          <div className="content-details fadeIn-bottom">
            <h3 className="content-title">{title}</h3>
            <h4 className="content-title">{subtitle}</h4>
          </div>
        </Link>
      </div>
    );
  });

  return (
    <div className="container-new-author">
      <h3>Author's posts:</h3>
      <div className="card-columns">{displayListPost}</div>
    </div>
  );
};
export default AuthorPostList;
