import React from 'react';
import { Marker } from 'react-leaflet';
import { renderToStaticMarkup } from "react-dom/server"; // used to customize Marker's icons
import { divIcon } from "leaflet"; // used to customize Marker's icons

function UserMarker({position}) {

    // -----------------------
    // METHODS
    // -----------------------
      
    // Customize Marker's icons
    const customMarker = () => {
      return divIcon({ html: renderToStaticMarkup(<span className="custom-marker custom-marker" />) })
    };

    // -----------------------
    // RENDER
    // -----------------------

    return (
        <Marker
            position={position}
            icon={customMarker()}
        />
    );
}

export default UserMarker;