import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Carousel } from '../components/Carousel';

import { imageCarousel } from 'paperframe-api/src'

export default function Home() {
  const [carousel, setCarousel] = useState([] as imageCarousel);
  const [current, setCurrent] = useState(null as null | number);

  const populateCarousel = async (): Promise<void> => {
    await fetch('https://paperframe-api.tsmithcreative.workers.dev/api/carousel')
      .then((res) => res.json())
      .then((payload) => setCarousel(payload))
      .catch((err) => {
        console.log(err);
        setCarousel([]);
      });
  };

  const activeCheck = async (): Promise<void> => {
    await fetch('https://paperframe-api.tsmithcreative.workers.dev/api/now/id')
      .then((res) => res.json())
      .then((payload) => setCurrent(parseInt(payload)))
      .catch((err) => {
        console.log(err);
        return setCurrent(null);
      });
  };

  const deleteHandler = async (id: number): Promise<boolean> => {
    const success = await fetch(`https://paperframe-api.tsmithcreative.workers.dev/api/image/${id}`, {
      method: 'DELETE'
    })
      .then((res) => res.status === 204)
      .catch((err) => {
        console.log(err);
        return false;
      });

      if (success) {
        populateCarousel();
        activeCheck();
        return true;
      } else {
        return false;
      }
  };

  useEffect(() => {
    populateCarousel();
    activeCheck();

    setInterval(() => {
      activeCheck();
    }, 1000 * 600);
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Paperframe</title>
      </Head>
      <header>
        <h1>Paperframe</h1>
      </header>
      <Carousel images={carousel} active={current} deleteHandler={deleteHandler} />
    </div>
  );
}