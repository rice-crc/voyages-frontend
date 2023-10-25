import { AppDispatch, RootState } from '@/redux/store';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { useDispatch, useSelector } from 'react-redux';
import { BASEURL } from '@/share/AUTH_BASEURL';
import '@/style/blogs.scss';
import { Divider } from '@mui/material';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import HeaderNavBarBlog from '../../NavigationComponents/Header/HeaderNavBarBlog';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchInstitutionData } from '@/fetch/blogFetch/fetchInstitutionData';
import {
  setInstitutionAuthorsData,
  setInstitutionAuthorsList,
} from '@/redux/getBlogDataSlice';
import InstitutionAuthorsList from './InstitutionAuthorsList';
import defaultImage from '@/assets/no-imge-default.avif';

const InstitutionAuthors: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { ID } = useParams();

  const { institutionData } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );

  const { image, name, description } = institutionData;

  useEffect(() => {
    let subscribed = true;
    const fetchInstitution = async () => {
      const dataSend: { [key: string]: (string | number)[] } = {
        id: [parseInt(ID!)],
      };
      try {
        const response = await dispatch(
          fetchInstitutionData(dataSend)
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
    fetchInstitution();
    return () => {
      subscribed = false;
    };
  }, [dispatch, ID]);

  return (
    <div>
      <HeaderLogoSearch />
      <HeaderNavBarBlog />
      <div className="container-new-institution">
        <div className="main-body">
          <div className="row-next-author">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                {image ? (
                  <img
                    src={`${BASEURL}${image}`}
                    alt={name}
                    className="rounded-circle"
                    width="300"
                  />
                ) : (
                  <img
                    src={defaultImage}
                    alt={name}
                    className="rounded-circle"
                    width="300"
                  />
                )}
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
