import { Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchAuthorData } from '@/fetch/blogFetch/fetchAuthorData';
import { RootState } from '@/redux/store';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { useSelector } from 'react-redux';
import AuthorPostList from './AuthorPostList';
import '@/style/blogs.scss';
import { setAuthorData, setAuthorPost } from '@/redux/getBlogDataSlice';
import AuthorInfo from './AuthorInfo';

const AuthorPost: React.FC = () => {
  const { ID } = useParams();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    let subscribed = true;
    const fetchDataBlog = async () => {
      const dataSend: { [key: string]: (string | number)[] } = {
        id: [parseInt(ID!)],
      };
      try {
        const response = await dispatch(fetchAuthorData(dataSend)).unwrap();
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
      <AuthorInfo />
      <Divider />
      <AuthorPostList />
    </>
  );
};
export default AuthorPost;
