import React, { useState } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from './ImagePreview';
import CameraControls from './CameraControls';

const TakePicture = ({pictureTaken}) => {
  
    // -----------------------
    // STATE
    // -----------------------

    const [dataUri, setDataUri] = useState('');
    const [shoot, setShoot] = useState(true);
  
    // -----------------------
    // METHODS
    // -----------------------
    
    const handleTakePhotoAnimationDone = (dataUri) => {
      setDataUri(dataUri);
      setShoot(false);
    };

    const validateCapture = () => {
      pictureTaken(dataUri);
    }

    const reShoot = () => {
      setShoot(true);
    }
  
    // -----------------------
    // RENDER
    // -----------------------
    
    return (
        <div className="take-picture">
        
          { shoot === true  &&
            <Camera onTakePhotoAnimationDone = {handleTakePhotoAnimationDone} />
          }
          {shoot === false &&
            <CameraControls validateCapture={validateCapture} reShoot={reShoot} />
          }
          {shoot === false &&
            <ImagePreview dataUri={dataUri} />
          }

        </div>
  );
}
export default TakePicture;