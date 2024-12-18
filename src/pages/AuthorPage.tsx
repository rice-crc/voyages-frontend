import AuthorPost from '@/components/BlogPageComponents/Author/AuthorPost';
import HeaderNavBarBlog from '@/components/NavigationComponents/Header/HeaderNavBarBlog';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';

const AuthorPage: React.FC = () => {
  return (
    <div className="blog-container">
      <HeaderLogoSearch />
      <HeaderNavBarBlog />
      <AuthorPost />
    </div>
  );
};
export default AuthorPage;
