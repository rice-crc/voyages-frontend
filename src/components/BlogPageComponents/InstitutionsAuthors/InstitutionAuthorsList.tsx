import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from '@/redux/store';
import { BASEURL } from '@/share/AUTH_BASEURL';
import '@/style/blogs.scss';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';

const InstitutionAuthorsList: React.FC = () => {
  const { institutionList } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps,
  );

  return (
    <div className="container-new-author">
      <h3>Institution Authors:</h3>
      {institutionList?.length > 0 &&
        institutionList?.map((institution, index) => (
          <div className="media" key={`${institution?.id}-${index}`}>
            <div
              className="media-left media-top"
              key={`${index}-${institution?.photo}`}
            >
              <Link
                to={`/${BLOGPAGE}/author/${institution?.name}/${institution?.id}/`}
              >
                {institution.photo ? (
                  <img
                    className="rounded-circle"
                    src={`${BASEURL}${institution?.photo}`}
                    width="64"
                    height="64"
                    alt={institution?.name}
                  />
                ) : (
                  <div className="avatar">
                    <i className="fas fa-user fa-10x" aria-hidden="true"></i>
                  </div>
                )}
              </Link>
            </div>
            <div className="media-body" key={`${index}-${institution?.name}`}>
              <h4 className="media-heading">
                <Link
                  to={`/${BLOGPAGE}/author/${institution?.name}/${institution?.id}/`}
                >
                  {institution?.institution?.name}
                </Link>
              </h4>
              <p>{institution?.role}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
export default InstitutionAuthorsList;
