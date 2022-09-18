import style from './carousel.module.scss';

import { imageCarousel } from 'paperframe-api/src';

interface CarouselProps {
  children?: any;
  images: imageCarousel;
  active: null | number;
  updateCurrentHandler: (id: number) => Promise<boolean>;
  deleteHandler: (id: number) => Promise<boolean>;
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
          <div className={style.order}>{index}</div>
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
              <button>Rename</button>
              <button
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
