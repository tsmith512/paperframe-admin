import style from './carousel.module.scss';

import { imageCarousel } from 'paperframe-api/src';

interface CarouselProps {
  children?: any;
  images: imageCarousel;
  active: null | number;
  deleteHandler: (id: number) => Promise<boolean>;
  authenticated: boolean;
}

export const Carousel = (props: CarouselProps) => {
  return (
    <div className={style.carousel}>
      {props.images.map((image) => (
        <div
          key={image.id}
          className={style.slide}
          data-active={props.active === image.id ? true : null}
        >
          <div className={style.order}>{image.order}</div>
          <div className={style.image}>
            <img
              src={`https://paperframe-api.tsmithcreative.workers.dev/api/image/${image.id}`}
              alt={image.title}
            />
          </div>
          <div className={style.title}>{image.title}</div>
          {props.authenticated && (
            <div className={style.actions}>
              <button>Display</button>
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
