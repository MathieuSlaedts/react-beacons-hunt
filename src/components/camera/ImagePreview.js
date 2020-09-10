import React from 'react';

const ImagePreview = ({dataUri}) => {

  return (
      <div className="image-preview">
        <img src={dataUri} />
      </div>
  );
};
export default ImagePreview;