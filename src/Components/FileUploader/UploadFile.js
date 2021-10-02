import React from "react";
import Compress from "compress.js";

const UploadFile = ({ callback = null }) => {
  const onFileChange = async (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      if (e.target.files[0].size > 30000) {
        const compress = new Compress();
        const file = e.target.files[0];
        const resizedImage = await compress.compress([file], {
          size: 0.03, // the max size in MB, defaults to 2MB
          quality: 1, // the quality of the image, max is 1,
          maxWidth: 700, // the max width of the output image, defaults to 1920px
          maxHeight: 700, // the max height of the output image, defaults to 1920px
          resize: true, // defaults to true, set false if you do not want to resize the image width and height
        });
        const img = resizedImage[0];
        const base64str = img.data;
        const imgExt = img.ext;
        const resizedFile = Compress.convertBase64ToFile(base64str, imgExt);
        callback(resizedFile);
      } else {
        callback(e.target.files[0]);
      }
    }
  };
  return (
    <React.Fragment>
      <input
        onChange={onFileChange}
        type="file"
        className="inputfile"
        id="embedpollfileinput"
      />
      <label
        htmlFor="embedpollfileinput"
        className="ui huge green right floated button"
      >
        <i className="ui upload icon"></i>
        Upload image
      </label>
    </React.Fragment>
  );
};

export default UploadFile;
