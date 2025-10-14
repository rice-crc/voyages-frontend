import React from 'react';

import BlogResultsList from '@/components/BlogPageComponents/Blogcomponents/BlogResultsList';
import MetaTag from '@/components/MetaTag/MetaTag';
import HeaderNavBarBlog from '@/components/NavigationComponents/Header/HeaderNavBarBlog';
import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';

const BlogPage: React.FC = () => {
  return (
    <div className="blog-container">
      <MetaTag
        pageTitle="Blog - Slave Voyages"
        pageDescription="Read articles and insights about the slave trade history."
      />
      <HeaderLogoSearch />
      <HeaderNavBarBlog />
      <BlogResultsList />
    </div>
  );
};

export default BlogPage;
