import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Carousel } from '../components/Carousel';

export default function Home() {
  const [carousel, setCarousel] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    fetch('https://paperframe-api.tsmithcreative.workers.dev/api/carousel')
      .then((res) => res.json())
      .then((payload) => setCarousel(payload))
      .catch((err) => {
        console.log(err);
        return [];
      });
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Paperframe</title>
      </Head>
      <header>
        <h1>Paperframe</h1>
      </header>
      <Carousel images={carousel} />
    </div>
  );
}
