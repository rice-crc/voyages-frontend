import { AppDispatch, RootState } from '@/redux/store';
import { BlogDataPropsRequest, BlogFilter, InitialStateBlogProps, InstitutionAuthor } from '@/share/InterfaceTypesBlog';
import { useDispatch, useSelector } from 'react-redux';
import { BASEURL } from '@/share/AUTH_BASEURL';
import '@/style/blogs.scss';
import { Divider } from '@mui/material';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import HeaderNavBarBlog from '../../NavigationComponents/Header/HeaderNavBarBlog';
import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { fetchInstitutionData } from '@/fetch/blogFetch/fetchInstitutionData';
import {
  setInstitutionAuthorsData,
  setInstitutionAuthorsList,
} from '@/redux/getBlogDataSlice';
import InstitutionAuthorsList from './InstitutionAuthorsList';
import defaultImage from '@/assets/no-imge-default.avif';
import { useInstitutionAuthor } from '@/hooks/useInstitutionAuthor';

const InstitutionAuthors: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { ID } = useParams();

  const { institutionData } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );
  const { image, name, description } = institutionData;

  const filters: BlogFilter[] = [];
  if ([parseInt(ID!)]) {
    filters.push({
      varName: "id",
      searchTerm: [parseInt(ID!)],
      op: "in"
    })
  }
  const dataSend: BlogDataPropsRequest = {
    filter: filters,
    page: 0,
    page_size: 12
  };
  const { data, isLoading, isError } = useInstitutionAuthor(dataSend);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const { results } = data;
      dispatch(setInstitutionAuthorsData(results?.[0]));
      const institutionList = results[0]?.institution_authors.map((value: InstitutionAuthor) => value);
      dispatch(setInstitutionAuthorsList((institutionList)));
    }
    return () => {
      setInstitutionAuthorsList([]);
    };
  }, [data, isLoading, isError, dispatch, ID]);

  return (
    <div className='blog-container'>
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
