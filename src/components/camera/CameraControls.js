import React from 'react';

const CameraControls = ({validateCapture, reShoot}) => {
  
  // -----------------------
  // HANDLERS
  // -----------------------

  const handleValidation = (ev) => {
    ev.preventDefault();
    validateCapture();
  }

  const handleReshoot = (ev) => {
    ev.preventDefault();
    reShoot();
  }
  
  // -----------------------
  // RENDER
  // -----------------------

  return (
    <div className="camera-controls">
        <button className="button is-primary" onClick={handleValidation}>Valider la capture du beacon</button>
        <button className="button is-primary" onClick={handleReshoot}>Reprendre une photo</button>
    </div>
  );
};

export default CameraControls;