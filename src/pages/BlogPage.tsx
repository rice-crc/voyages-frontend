import BlogResultsList from '@/components/BlogComponents/BlogResultsList';
import HeaderNavBarBlog from '@/components/NavigationComponents/Header/HeaderNavBarBlog';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import React from 'react';

const BlogPage: React.FC = () => {
  return (
    <>
      <HeaderLogoSearch />
      <HeaderNavBarBlog />
      <BlogResultsList />
    </>
  );
};

export default BlogPage;
