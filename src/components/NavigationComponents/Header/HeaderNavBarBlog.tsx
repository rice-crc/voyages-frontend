import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '@/redux/store';
import '@/style/blogs.scss';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';

const HeaderNavBarBlog: React.FC = () => {
  const navigate = useNavigate();
  const { post } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps,
  );
  const { title } = post;

  const handleReloadPage = () => {
    navigate(`/${BLOGPAGE}`);
  };

  return (
    <>
      <div className="nav-blog-header nav-blog-header-sticky">
        <div>
          <button
            onClick={handleReloadPage}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div>{`Echoes: The SlaveVoyages Blog ${title ? `- ${title}` : ''}`}</div>
          </button>
        </div>
      </div>
    </>
  );
};
export default HeaderNavBarBlog;
//
