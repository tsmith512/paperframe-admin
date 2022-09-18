import Head from 'next/head';
import { useEffect, useState } from 'react';

import { imageCarousel } from 'paperframe-api/src';

import { Carousel, UploadForm } from '../components';

export default function Home(props) {
  const [carousel, setCarousel] = useState([] as imageCarousel);
  const [current, setCurrent] = useState(null as null | number);
  const [unsavedChanges, setUnsavedChanges] = useState(false as boolean);

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
    if (!props.authed) {
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

  const updateOrderHandler = async (): Promise<boolean> => {
    // This UI will be hidden and API will forbid, but bail if unauthenticated
    if (!props.authed) {
      return;
    }

    const success = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/carousel`, {
      method: 'POST',
      body: JSON.stringify(carousel.map((i) => i.id)),
    })
      .then((res) => res.status === 204)
      .catch((err) => {
        console.log(err);
        return false;
      });

    if (success) {
      // No need to fetch the carousel from remote, we just set it.
      setUnsavedChanges(false);
    }
  };

  const reorderHandler = (index: number, direction: number): void => {
    // The first can't get earlier; the last can't get later.
    if (index === 0 && direction === -1) {
      return;
    } else if (index === carousel.length - 1 && direction === 1) {
      return;
    }

    // Duplicate the carousel so we can edit it and then set it as state
    const newCarousel = [...carousel];
    const image = newCarousel.splice(index, 1);
    newCarousel.splice(index + direction, 0, image.pop());

    // Commit the new carousel to state, but it is LOCAL ONLY, so warn the user.
    setCarousel(newCarousel);
    setUnsavedChanges(true);
  };

  const deleteHandler = async (id: number): Promise<boolean> => {
    // This UI will be hidden and API will forbid, but bail if unauthenticated
    if (!props.authed) {
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
    if (!props.authed) {
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

  // Fire an update to the carousel and active frame on load and also on an
  // authentication state change
  useEffect(() => {
    getCarousel();
    getCurrent();
  }, [props.authed]);

  // Check the active slide every 15 minutes, assuming the window is visible.
  setInterval(() => {
    if (typeof window !== 'undefined' && document.visibilityState === 'visible') {
      getCurrent();
    }
  }, 1000 * 900);

  return (
    <div className="container">
      <Head>
        <title>Image Carousel | Paperframe</title>
      </Head>
      <h2>Image Carousel</h2>
      {unsavedChanges && <button onClick={updateOrderHandler}>Save New Order</button>}
      <Carousel
        images={carousel}
        active={current}
        updateCurrentHandler={updateCurrentHandler}
        deleteHandler={deleteHandler}
        reorderHandler={reorderHandler}
        authenticated={props.authed}
      />
      {props.authed && <UploadForm uploadHandler={uploadHandler} />}
    </div>
  );
}
