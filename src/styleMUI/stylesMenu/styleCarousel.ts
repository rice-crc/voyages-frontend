import styled from 'styled-components';

export const StyledCard = styled.div`
  width: 100%;
  background: #3f3f3f;
  height: 350px;
  padding: rem 0;
  .ant-carousel {
    .slick-slider {
      .slick-arrow {
        top: 50%;
        color: #fff;
        z-index: 2;
        font-size: 30px;

        .anticon {
          font-size: 20px;
        }
      }

      .slick-prev {
        left: 10px;
      }

      .slick-next {
        right: 10px;
      }
    }

    .slick-list {
      height: 330px;
    }

    .slick-track {
      height: 320px;
      overflow: hidden;
    }

    .slick-slide {
      text-align: center;
      img {
        display: block;
        width: 100%;
        padding: 2rem;
        height: 280px;
      }

      > div {
        overflow: hidden;
        transform: scale(0.9);
        transition: all 300ms ease;
        padding: 10px 0;
      }

      &.slick-center {
        &:hover {
          .slide-overlay {
            left: 0;
          }
        }
      }
    }

    .slide-overlay {
      display: flex;
      align-content: center;
      position: absolute;
      width: 150px;
      height: 150px;
      top: 0;
      left: -150px;
      background: rgba(0, 0, 0, 0.75);
      transition: all 300ms ease;
    }

    .slide-actions {
      display: flex;
      align-items: center;
      width: 80px;
      height: 40px;
      margin: auto;

      > button {
        color: #fff;
        background: transparent;
        border: 0;
        font-size: 18px;
        transition: all 300ms ease-in;

        &:hover {
          transform: scale(1.2);
        }
      }

      > span {
        display: inline-block;
        border-right: 1px solid #fff;
        height: 40px;
        margin: 0 5px;
      }
    }

    .slick-dots {
      li {
        button {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          opacity: 1;
          background-color: rgb(223 223 223);
        }

        &.slick-active {
          button {
            background-color: #1890ff;
          }
        }
      }
    }
  }
`;
