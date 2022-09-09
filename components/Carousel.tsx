import style from './carousel.module.scss';

interface CarouselProps {
  children?: any;
  images: any[];
}

export const Carousel = (props: CarouselProps) => {
  return (
    <div className={style.carousel}>
      {props.images.map((image) => (
        <div key={image.id} className={style.slide}>
          <div className={style.order}>{image.order}</div>
          <div className={style.image}>
            <img
              src={`https://paperframe-api.tsmithcreative.workers.dev/api/image/${image.id}`}
              alt={image.title}
            />
          </div>
          <div className={style.title}>{image.title}</div>
          <div className={style.actions}>
            <button>Display</button>
            <button>Rename</button>
            <button>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};
