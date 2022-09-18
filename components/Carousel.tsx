import style from './carousel.module.scss';

import { imageCarousel } from 'paperframe-api/src';

interface CarouselProps {
  children?: any;
  images: imageCarousel;
  active: null | number;
  updateCurrentHandler: (id: number) => Promise<void>;
  deleteHandler: (id: number) => Promise<void>;
  reorderHandler: (index: number, direction: number) => void;
  authenticated: boolean;
}

export const Carousel = (props: CarouselProps) => {
  return (
    <div className={style.carousel}>
      {props.images.map((image, index) => (
        <div
          key={image.id}
          className={style.slide}
          data-active={props.active === image.id ? true : null}
        >
          <div className={style.order}>
            {index !== 0 && (
              <button
                className="outline"
                onClick={(e) => {
                  e.preventDefault();
                  props.reorderHandler(index, -1);
                }}
              >
                &uarr;
              </button>
            )}
            <div>{index}</div>
            {index < props.images.length - 1 && (
              <button
                className="outline"
                onClick={(e) => {
                  e.preventDefault();
                  props.reorderHandler(index, 1);
                }}
              >
                &darr;
              </button>
            )}
          </div>
          <div className={style.image}>
            <img
              src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/image/${image.id}`}
              alt={image.title}
            />
          </div>
          <div className={style.title}>
            <span>{image.id}</span> {image.title}
          </div>
          {props.authenticated && (
            <div className={style.actions}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  props.updateCurrentHandler(image.id);
                }}
              >
                Display
              </button>
              <button
                className="secondary outline"
                onClick={(e) => {
                  e.preventDefault();
                  props.deleteHandler(image.id);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
