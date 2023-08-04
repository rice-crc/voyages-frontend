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
  return (
    <div className="container-new-author">
      <h3>Author's posts:</h3>
      <div className="card-columns">
        {authorPost.map((value) => (
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
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AuthorPostList;
