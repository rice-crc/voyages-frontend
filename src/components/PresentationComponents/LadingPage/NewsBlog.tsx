import React, { useEffect, useRef } from 'react';

import '@/style/landing.scss';
import { useDispatch, useSelector } from 'react-redux';

import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import { fetchBlogData } from '@/fetch/blogFetch/fetchBlogData';
import { setBlogData, setBlogPost } from '@/redux/getBlogDataSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { LanguagesProps } from '@/share/InterfaceTypeLanguages';
import {
  BlogDataProps,
  BlogDataPropsRequest,
  BlogFilter,
  InitialStateBlogProps,
} from '@/share/InterfaceTypesBlog';
import 'react-multi-carousel/lib/styles.css';
import { translationHomepage } from '@/utils/functions/translationLanguages';

import { CardNewsBlogs } from './CardNewsBlogs';

const NewsBlog: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { languageValueLabel, languageValue } = useSelector(
    (state: RootState) => state.getLanguages as LanguagesProps,
  );
  const translatedHomepage = translationHomepage(languageValue);

  const { data: carouselItems } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps,
  );
  const imagesPerPage = 127;

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--num',
      carouselItems.length.toString(),
    );
  }, [carouselItems]);

  const effectOnce = useRef(false);

  useEffect(() => {
    const fetchDataBlog = async () => {
      const filters: BlogFilter[] = [];
      if (languageValue) {
        filters.push(
          {
            varName: 'language',
            searchTerm: [languageValue],
            op: 'in',
          },
          {
            varName: 'tags__name',
            searchTerm: ['News'],
            op: 'in',
          },
        );
      }
      const dataSend: BlogDataPropsRequest = {
        filter: filters,
        page_size: imagesPerPage,
      };
      try {
        const response = await dispatch(fetchBlogData(dataSend)).unwrap();
        if (response) {
          const { results } = response;
          dispatch(setBlogData(results));
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    if (!effectOnce.current) {
      fetchDataBlog();
    }
    return () => {
      dispatch(setBlogPost({} as BlogDataProps));
    };
  }, [dispatch, languageValueLabel, languageValue]);

  return (
    <div className="content-news-blog-container">
      <div className="blog-news-header">
        <h1>{translatedHomepage.homePageNews}</h1>
        <p>{translatedHomepage.homePageNewsDes}</p>
        <ButtonLearnMore path={BLOGPAGE} />
      </div>
      <CardNewsBlogs />
    </div>
  );
};

export default NewsBlog;
