import { BASEURL } from '@/share/AUTH_BASEURL';
import defaultImage from '@/assets/voyage-blog.png';
import '@/style/landing.scss';
import { InitialStateBlogProps } from '@/share/InterfaceTypesBlog';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { formatTextURL } from '@/utils/functions/formatText';

const responsive = {
  desktopM: {
    breakpoint: { max: 3000, min: 1440 },
    items: 5,
    slidesToSlide: 5, // optional, default to 1.
  },
  desktopS: {
    breakpoint: { max: 1440, min: 1024 },
    items: 4,
    slidesToSlide: 4, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export const CardNewsBlogs = () => {
  const { data: carouselItems } = useSelector(
    (state: RootState) => state.getBlogData as InitialStateBlogProps
  );
  return (
    <div className="parent-carousel">
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={true}
        partialVisible={false}
        dotListClass="custom-dot-list-style"
      >
        {carouselItems.length > 0 &&
          carouselItems.map((t) => {
            const { thumbnail, title, id } = t;
            const imageUrl = thumbnail
              ? `${BASEURL}${thumbnail}`
              : defaultImage;
            return (
              <div className="slider" key={id}>
                <Link to={`/${BLOGPAGE}/${formatTextURL(title)}/${id}`}>
                  <img
                    src={imageUrl}
                    alt={title}
                    className="content-image-slide"
                  />
                  <div className="carousel-caption">
                    <h5>{title}</h5>
                  </div>
                </Link>
              </div>
            );
          })}
      </Carousel>
    </div>
  );
};
