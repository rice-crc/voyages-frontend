import React, { useEffect, useRef } from 'react';
import '@/style/landing.scss';
import { fetchBlogData } from '@/fetch/blogFetch/fetchBlogData';
import { setBlogData, setBlogPost } from '@/redux/getBlogDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { BlogDataProps, BlogDataPropsRequest, BlogFilter, InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import ButtonLearnMore from '@/components/SelectorComponents/ButtonComponents/ButtonLearnMore';
import { CardNewsBlogs } from './CardNewsBlogs';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { translationHomepage } from '@/utils/functions/translationLanguages';

const ArtInspiredBySlaveVoyages: React.FC = () => {
    const imagesPerPage = 127
    const { data: carouselItems } = useSelector(
        (state: RootState) => state.getBlogData as InitialStateBlogProps
    );
    const dispatch: AppDispatch = useDispatch();

    const { languageValueLabel, languageValue } = useSelector((state: RootState) => state.getLanguages);
    const translatedHomepage = translationHomepage(languageValue)

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--num',
            carouselItems.length.toString()
        );
    }, [carouselItems]);

    const effectOnce = useRef(false);
    const fetchDataBlog = async () => {
        const filters: BlogFilter[] = [];
        if (languageValue) {
            filters.push({
                varName: 'language',
                searchTerm: [languageValue],
                op: 'in',
            });
        }
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
    }, [dispatch, languageValueLabel]);


    return (
        <div className="content-inspried-container">
            <div className="blog-news-header">
                <h1>{translatedHomepage.homePageArt}</h1>
                <p>{translatedHomepage.homePageArtDes}
                </p>
                <ButtonLearnMore path={BLOGPAGE} />
            </div>
            <CardNewsBlogs />
        </div>
    );
};

export default ArtInspiredBySlaveVoyages;
