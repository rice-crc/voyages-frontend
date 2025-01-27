import React from 'react';
import '@/style/landing.scss';

interface ButtonNextPrevBlogProps {
  setMoveClass: React.Dispatch<React.SetStateAction<string>>;
}
export const ButtonNextPrevBlog = (props: ButtonNextPrevBlogProps) => {
  const { setMoveClass } = props;
  const handleNextClick = () => {
    setMoveClass('next');
    setTimeout(() => {
      setMoveClass('slide-track');
    }, 4000);
  };

  const handlePrevClick = () => {
    setMoveClass('prev');
    setTimeout(() => {
      setMoveClass('slide-track');
    }, 4000);
  };

  return (
    <div className="ui">
      <button onClick={handlePrevClick} className="prev">
        <span className="material-icons">chevron_left</span>
      </button>
      <button onClick={handleNextClick} className="next">
        <span className="material-icons">chevron_right</span>
      </button>
    </div>
  );
};
