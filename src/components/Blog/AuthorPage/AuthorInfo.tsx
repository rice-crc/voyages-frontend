import HeaderLogoSearch from '@/components/header/HeaderSearchLogo';
import NavBlog from '../NavBlog';
import { Divider } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchAuthorData } from '@/fetchAPI/blogApi/fetchAuthorData';
import { RootState } from '@/redux/store';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { useSelector } from 'react-redux';
import AuthorPostList from './AuthorPostList';
import { BASTURLBLOG } from '@/share/AUTH_BASEURL';
import '@/style/blogs.scss';
import { setAuthorData, setAuthorPost } from '@/redux/getBlogDataSlice';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { convertToSlug } from '@/utils/functions/convertToSlug';

const AuthorInfo: React.FC = () => {
  const { ID } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const { author } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );
  const { name, description, role, photo, institution } = author;
  useEffect(() => {
    let subscribed = true;
    const fetchDataBlog = async () => {
      const newFormData: FormData = new FormData();
      newFormData.append('id', String(ID));
      newFormData.append('id', String(ID));
      try {
        const response = await dispatch(fetchAuthorData(newFormData)).unwrap();
        if (subscribed && response) {
          dispatch(setAuthorData(response?.[0]));
          dispatch(setAuthorPost(response?.[0]?.posts));
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchDataBlog();
    return () => {
      subscribed = false;
    };
  }, [dispatch, ID]);

  return (
    <>
      <HeaderLogoSearch />
      <NavBlog />
      <div className="container-new-author-head">
        <div className="main-body">
          <div className="row-next-author">
            <div className="col-lg-4">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <img
                    src={`${BASTURLBLOG}${photo ? photo : ''}`}
                    alt="Greg O'Malley"
                    className="rounded-circle "
                    width="300"
                  />

                  <div className="mt-3">
                    <h4 className="auther-name">{name}</h4>
                    <p className="text-secondary-author">{role}</p>
                    <p className="author-universityname">
                      <Link
                        to={`/${BLOGPAGE}/${
                          description && convertToSlug(description)
                        }/${institution}`}
                      >
                        <p>University of California, Santa Cruz</p>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="description-author">{description ?? '--'}</div>
          </div>
        </div>
      </div>
      <Divider />
      <AuthorPostList />
    </>
  );
};
export default AuthorInfo;
