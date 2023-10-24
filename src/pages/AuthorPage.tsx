import AuthorPost from '@/components/BlogPageComponents/Author/AuthorPost';
import HeaderNavBarBlog from '@/components/NavigationComponents/Header/HeaderNavBarBlog';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';

const AuthorPage: React.FC = () => {
  return (
    <>
      <HeaderLogoSearch />
      <HeaderNavBarBlog />
      <AuthorPost />
    </>
  );
};
export default AuthorPage;
