import React from 'react';

const ImagePreview = ({dataUri}) => {
  
  // -----------------------
  // RENDER
  // -----------------------

  return (
      <div className="image-preview">
        <img src={dataUri} alt="selfie" />
      </div>
  );
};
export default ImagePreview;