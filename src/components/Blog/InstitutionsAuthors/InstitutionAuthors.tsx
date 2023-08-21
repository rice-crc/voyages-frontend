import { AppDispatch, RootState } from '@/redux/store';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { useDispatch, useSelector } from 'react-redux';
import { BASTURLBLOG } from '@/share/AUTH_BASEURL';
import '@/style/blogs.scss';
import { Divider } from '@mui/material';
import HeaderLogoSearch from '@/components/header/HeaderSearchLogo';
import NavBlog from '../NavBarBlog';
import IMGMOCK from '@/assets/sv-logo-black-01.png';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchInstitutionDataAPI } from '@/fetchAPI/blogApi/fetchInstitutionDataAPI';
import {
  setInstitutionAuthorsData,
  setInstitutionAuthorsList,
} from '@/redux/getBlogDataSlice';
import InstitutionAuthorsList from './InstitutionAuthorsList';

const InstitutionAuthors: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { ID } = useParams();

  const { institutionData } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );

  const { image, name, description } = institutionData;

  useEffect(() => {
    let subscribed = true;
    const fetchInstitutionData = async () => {
      const newFormData: FormData = new FormData();
      newFormData.append('id', String(ID));
      newFormData.append('id', String(ID));
      try {
        const response = await dispatch(
          fetchInstitutionDataAPI(newFormData)
        ).unwrap();
        if (subscribed && response) {
          dispatch(setInstitutionAuthorsData(response?.[0]));
          dispatch(
            setInstitutionAuthorsList(response?.[0]?.institution_authors)
          );
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchInstitutionData();
    return () => {
      subscribed = false;
    };
  }, [dispatch, ID]);
  return (
    <div>
      <HeaderLogoSearch />
      <NavBlog />
      <div className="container-new-institution">
        <div className="main-body">
          <div className="row-next-author">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                <img
                  src={image ? `${BASTURLBLOG}${image}` : IMGMOCK}
                  alt={name}
                  className="rounded-circle"
                  width="300"
                />
                <div className="mt-3">
                  <h4 className="auther-name">{name}</h4>
                  <p className="text-secondary-author">{description ?? '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <InstitutionAuthorsList />
      </div>
    </div>
  );
};
export default InstitutionAuthors;
