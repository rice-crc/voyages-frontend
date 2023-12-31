import React, { useEffect, useState } from 'react';
import '@/style/landing.scss';
import { fetchBlogData } from '@/fetch/blogFetch/fetchBlogData';
import { setBlogData } from '@/redux/getBlogDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { CardNewsBlogs } from './CardNewsBlogs';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import { ButtonNextPrevBlog } from '../../SelectorComponents/ButtonComponents/ButtonNextPrevBlog';
import { BLOGPAGE } from '@/share/CONST_DATA';

const NewsBlog: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();
  const { language } = useSelector((state: RootState) => state.getLanguages);
  const { data: carouselItems } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );
  const [moveClass, setMoveClass] = useState('slide-track');

  useEffect(() => {
    document.documentElement.style.setProperty('--num', carouselItems.length.toString());
  }, [carouselItems])

  const handleAnimationEnd = () => {
    if (moveClass === 'prev') {
      shiftNext([...carouselItems]);
    } else if (moveClass === 'next') {
      shiftPrev([...carouselItems]);
    }
    setMoveClass('')
  }

  const shiftPrev = (copy: any) => {
    let lastcard = copy.pop();
    copy.splice(0, 0, lastcard);
    dispatch(setBlogData(copy))
  }

  const shiftNext = (copy: any) => {
    let firstcard = copy.shift();
    copy.splice(copy.length, 0, firstcard);
    dispatch(setBlogData(copy))

  }

  useEffect(() => {
    let subscribed = true;

    const fetchDataBlog = async () => {
      const dataSend: { [key: string]: (string | number)[] } = {
        tags__name: ["News"],
        language: [language],
        "order_by": ["updated_on"]
      };

      try {
        const response = await dispatch(fetchBlogData(dataSend)).unwrap();
        if (response) {
          dispatch(setBlogData(response));
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchDataBlog();

    return () => {
      subscribed = false;
    };
  }, [dispatch, language]);


  return (
    <div className="content-news-blog-container">
      <div className="blog-news-header">
        <h1>News</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <ButtonLearnMore path={BLOGPAGE} />
      </div>
      <div className="carouselwrapper module-wrapper">
        <ButtonNextPrevBlog setMoveClass={setMoveClass} />
        <ul onAnimationEnd={handleAnimationEnd} className={`${moveClass} carousel`} >
          {carouselItems.length > 0 && carouselItems.map((t, index) =>
            <CardNewsBlogs key={t?.title + index} thumbnail={t?.thumbnail!} title={t?.title!} id={t?.id} />
          )}
        </ul>
      </div >
    </div>

  )
}

export default NewsBlog