//  _         _
// (_)_ _  __| |_____ __
// | | ' \/ _` / -_) \ /
// |_|_||_\__,_\___/_\_\
//
// Main image carousel admin page. Inherits authed (bool) property from _app, so
// it starts as a readonly display of images in the system, ordered, with the
// active one highlighted. If the user is authenticated, buttons to change the
// order and upload/delete frames are added.
//
// The carousel and which frame is currently on display are fetched here and
// passed in props to child components. Handlers to add/change frames, current,
// and order are here, too.

import Head from 'next/head';
import { useEffect, useState } from 'react';

// Pull in the types used by the API project so they can stay in sync.
import { imageCarousel } from 'paperframe-api/src';

import { Carousel, UploadForm } from '../components';

export default function Home(props) {
  const [carousel, setCarousel] = useState([] as imageCarousel);
  const [current, setCurrent] = useState(null as null | number);
  const [unsavedChanges, setUnsavedChanges] = useState(false as boolean);

  //                                _
  //   __ __ _ _ _ ___ _  _ ___ ___| |
  //  / _/ _` | '_/ _ \ || (_-</ -_) |
  //  \__\__,_|_| \___/\_,_/__/\___|_|

  /**
   * Get the current carousel and save it to state
   */
  const getCarousel = async (): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/carousel`)
      .then((res) => res.json())
      .then((payload: imageCarousel) => setCarousel(payload))
      .catch((err) => {
        console.log(err);
        setCarousel([]);
      });
  };

  /**
   * Move an image (by its index) forward or backward in the carousel array.
   * This is a local change!
   *
   * @param index (number) the image to move, as an index in the carousel array
   * @param direction (-1 | 1) move it earlier (-1) or later (1) in the stack
   * @returns void, but sets new carousel in state, sets the unsavedChanges flag
   */
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

  /**
   * Update the order of the carousel based on current state
   *
   * @returns void, but clears UnsavedChanges state flag on success
   */
  const updateOrderHandler = async (): Promise<void> => {
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

  //                          _      __
  //  __ _  _ _ _ _ _ ___ _ _| |_   / _|_ _ __ _ _ __  ___
  // / _| || | '_| '_/ -_) ' \  _| |  _| '_/ _` | '  \/ -_)
  // \__|\_,_|_| |_| \___|_||_\__| |_| |_| \__,_|_|_|_\___|

  /**
   * Get the current frame and save to state
   */
  const getCurrent = async (): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/now/id`)
      .then((res) => res.json())
      .then((payload: string) => setCurrent(parseInt(payload)))
      .catch((err) => {
        console.log(err);
        return setCurrent(null);
      });
  };

  /**
   * Update the current frame on display
   *
   * @param index (number) the image ID to set as the current frame
   * @returns void, but does set the new current frame in state on success
   */
  const updateCurrentHandler = async (index: number): Promise<void> => {
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

  //  _
  // (_)_ __  __ _ __ _ ___ ___
  // | | '  \/ _` / _` / -_|_-<
  // |_|_|_|_\__,_\__, \___/__/
  //              |___/

  /**
   * Delete an image (by ID) from the system
   *
   * @param id (number) image id to delete from storage and metadata
   * @returns void, but calls a re-fetch of carousel and current frame
   */
  const deleteHandler = async (id: number): Promise<void> => {
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
    }
  };

  /**
   * Upload a new image to the API from the UploadForm component.
   *
   * @TODO: Should this move into that component?
   * @TODO: There's some shitty form field identification in here.
   *
   * @param event (form submission event) the onSubmit handler from the form
   * @returns void, but if successful, re-fetches current/carousel, resets form
   */
  const uploadHandler = async (event): Promise<void> => {
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
