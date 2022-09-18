import style from './uploadform.module.scss';

interface uploadFormProps {
  uploadHandler: (event) => Promise<void>;
}

export const UploadForm = (props: uploadFormProps) => {
  return (
    <>
      <h2>Upload New</h2>
      <form className={style.uploadForm} onSubmit={props.uploadHandler}>
        <label>
          <span>Title:</span>
          <input type="text" name="title" id="titleInput" />
        </label>
        <label>
          <span>File:</span>
          <input type="file" name="image" id="imageInput" />
        </label>
        <div>
          <input type="submit" name="submit" value="Upload" />
        </div>
      </form>
    </>
  );
};
