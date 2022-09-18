import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Carousel } from '../components/Carousel';

import { imageCarousel } from 'paperframe-api/src';
import { UploadForm } from '../components/UploadForm';

export default function Home() {
  const [carousel, setCarousel] = useState([] as imageCarousel);
  const [current, setCurrent] = useState(null as null | number);
  const [authed, setAuthed] = useState(false);

  const getCarousel = async (): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/carousel`)
      .then((res) => res.json())
      .then((payload: imageCarousel) => setCarousel(payload))
      .catch((err) => {
        console.log(err);
        setCarousel([]);
      });
  };

  const getCurrent = async (): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/now/id`)
      .then((res) => res.json())
      .then((payload: string) => setCurrent(parseInt(payload)))
      .catch((err) => {
        console.log(err);
        return setCurrent(null);
      });
  };

  const updateCurrentHandler = async (index: number): Promise<boolean> => {
    // This UI will be hidden and API will forbid, but bail if unauthenticated
    if (!authed) {
      return;
    }

    const success = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/now`, {
      method: 'POST',
      body: JSON.stringify(index),
    })
      .then((res) => res.status === 204)
      .catch((err) => {
        console.log(err);
        return false;
      });

    if (success) {
      // No need to fetch it from remote, we just set it.
      setCurrent(index);
    }
  };

  const deleteHandler = async (id: number): Promise<boolean> => {
    // This UI will be hidden and API will forbid, but bail if unauthenticated
    if (!authed) {
      return;
    }

    const success = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/image/${id}`,
      {
        method: 'DELETE',
      }
    )
      .then((res) => res.status === 204)
      .catch((err) => {
        console.log(err);
        return false;
      });

    if (success) {
      getCarousel();
      getCurrent();
      return true;
    } else {
      return false;
    }
  };

  const uploadHandler = async (event): Promise<boolean> => {
    // This UI will be hidden and API will forbid, but bail if unauthenticated
    if (!authed) {
      return;
    }

    event.preventDefault();

    const formData = new FormData();
    const imageFile = document.querySelector('#imageInput') as HTMLInputElement;
    const imageTitle = document.querySelector('#titleInput') as HTMLInputElement;

    formData.append('image', imageFile.files[0]);
    formData.append('title', imageTitle.value);

    const success = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/image`, {
      method: 'POST',
      body: formData,
    });

    if (success) {
      getCarousel();
      getCurrent();
      event.target.reset();
      return true;
    } else {
      return false;
    }
  };

  const authCheck = async (): Promise<void> => {
    const isAuthenticated = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/check`
    )
      .then((res) => res.status === 204)
      .catch(() => false);

    setAuthed(isAuthenticated);
  };

  // Fire an auth check on load
  useEffect(() => {
    authCheck();
  });

  // Fire an update to the carousel and active frame on load and also on an
  // authentication state change
  useEffect(() => {
    getCarousel();
    getCurrent();
  }, [authed]);

  // Check the active slide every 15 minutes, assuming the window is visible.
  setInterval(() => {
    if (typeof window !== 'undefined' && document.visibilityState === 'visible') {
      getCurrent();
    }
  }, 1000 * 900);

  return (
    <div className="container">
      <Head>
        <title>Paperframe</title>
      </Head>
      <header>
        <h1>Paperframe</h1>
        {authed ? (
          <a href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/logout`}>Logout</a>
        ) : (
          <a href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/login`}>Login</a>
        )}
      </header>
      <Carousel
        images={carousel}
        active={current}
        updateCurrentHandler={updateCurrentHandler}
        deleteHandler={deleteHandler}
        authenticated={authed}
      />
      {authed && <UploadForm uploadHandler={uploadHandler} />}
    </div>
  );
}
