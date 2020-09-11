import React from 'react';
import { Marker } from 'react-leaflet';
import { renderToStaticMarkup } from "react-dom/server"; // used to customize Marker's icons
import { divIcon } from "leaflet"; // used to customize Marker's icons

function BeaconMarker({id, position, handleClickOnBeacon}) {

    // -----------------------
    // METHODS
    // -----------------------
      
    // Customize Marker's icons
    const customMarker = () => {
      return divIcon({ html: renderToStaticMarkup(<span id={id} className="custom-marker custom-marker-beacon" />) })
    };

    const handleClick = () => {
        handleClickOnBeacon(id);
    };

    // -----------------------
    // RENDER
    // -----------------------

    return (
        <Marker
            position={position}
            icon={customMarker()}
            onclick={handleClick}
        />
    );
}

export default BeaconMarker;