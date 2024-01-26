import { Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { fetchAuthorData } from '@/fetch/blogFetch/fetchAuthorData';
import AuthorPostList from './AuthorPostList';
import '@/style/blogs.scss';
import { setAuthorData, setAuthorPost } from '@/redux/getBlogDataSlice';
import AuthorInfo from './AuthorInfo';
import { BlogDataPropsRequest, BlogFilter } from '@/share/InterfaceTypesBlog';

const AuthorPost: React.FC = () => {
  const { ID } = useParams();
  const dispatch: AppDispatch = useDispatch();
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
      const response = await dispatch(fetchAuthorData(dataSend)).unwrap();
      if (response) {
        dispatch(setAuthorData(response?.results[0]));
        dispatch(setAuthorPost(response?.results[0]?.posts));
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

  return (
    <>
      <AuthorInfo />
      <Divider />
      <AuthorPostList />
    </>
  );
};
export default AuthorPost;
