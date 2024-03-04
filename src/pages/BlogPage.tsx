import BlogResultsList from '@/components/BlogPageComponents/Blogcomponents/BlogResultsList';
import HeaderNavBarBlog from '@/components/NavigationComponents/Header/HeaderNavBarBlog';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import React from 'react';

const BlogPage: React.FC = () => {
  return (
    <div className='blog-container'>
      <HeaderLogoSearch />
      <HeaderNavBarBlog />
      <BlogResultsList />
    </div>
  );
};

export default BlogPage;
