import React, { useEffect, useRef, useState } from 'react';
import '@/style/landing.scss';
import { fetchBlogData } from '@/fetch/blogFetch/fetchBlogData';
import { setBlogData, setBlogPost } from '@/redux/getBlogDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { BlogDataProps, BlogDataPropsRequest, BlogFilter, InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import { CardNewsBlogs } from './CardNewsBlogs';
import { ButtonNextPrevBlog } from '@/components/SelectorComponents/ButtonComponents/ButtonNextPrevBlog';
import { BLOGPAGE } from '@/share/CONST_DATA';

const ArtInspiredBySlaveVoyages: React.FC = () => {
    const imagesPerPage = 127
    const [moveClass, setMoveClass] = useState('slide-track slider');
    const { data: carouselItems } = useSelector(
        (state: RootState) => state.getBlogData as InitialStateBlogProps
    );
    const dispatch: AppDispatch = useDispatch();

    const { language } = useSelector((state: RootState) => state.getLanguages);

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--num',
            carouselItems.length.toString()
        );
    }, [carouselItems]);

    const handleAnimationEnd = () => {
        if (moveClass === 'prev') {
            shiftNext([...carouselItems]);
        } else if (moveClass === 'next') {
            shiftPrev([...carouselItems]);
        }
        setMoveClass('');
    };

    const shiftPrev = (copy: any) => {
        let lastcard = copy.pop();
        copy.splice(0, 0, lastcard);
        dispatch(setBlogData(copy));
    };

    const shiftNext = (copy: any) => {
        let firstcard = copy.shift();
        copy.splice(copy.length, 0, firstcard);
        dispatch(setBlogData(copy));
    };

    const effectOnce = useRef(false);
    const fetchDataBlog = async () => {
        const filters: BlogFilter[] = [];

        const dataSend: BlogDataPropsRequest = {
            filter: filters,
            page_size: imagesPerPage,
        };

        try {
            const response = await dispatch(fetchBlogData(dataSend)).unwrap();
            if (response) {
                const { results } = response
                dispatch(setBlogData(results));
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        if (!effectOnce.current) {
            fetchDataBlog();
        }
        return () => {
            dispatch(setBlogPost({} as BlogDataProps));
        };
    }, [dispatch, language]);

    return (
        <div className="content-inspried-container">
            <div className="blog-news-header">
                <h1>Art Inspired by SlaveVoyages</h1>
                <p>
                    A selection of artwork inspired by the data on the site. Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                </p>
                <ButtonLearnMore path={BLOGPAGE} />
            </div>

            <div className="carouselwrapper module-wrapper">
                <ButtonNextPrevBlog setMoveClass={setMoveClass} />
                <ul
                    onAnimationEnd={handleAnimationEnd}
                    className={`${moveClass} carousel`}
                >
                    {carouselItems.length > 0 &&
                        carouselItems.map((t, index) => (
                            <CardNewsBlogs
                                key={t?.title + index}
                                thumbnail={t?.thumbnail!}
                                title={t?.title!}
                                id={t?.id!}
                            />
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default ArtInspiredBySlaveVoyages;
