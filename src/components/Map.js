import React, { useState, useEffect } from 'react';
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { Map as OsmMap, Marker, Popup, Circle, TileLayer } from 'react-leaflet';

function Map(props) {

  // Customize Icon Marker
  const customMarkerIcon = divIcon({
    html: renderToStaticMarkup(<span className="custom-marker" />)
  });

  // Hanle click on map
  const handleClickOnMap = (ev) => {
    //console.log(ev.latlng);
  };

  // State - geolocation
  const [geoloc, setGeoloc] = useState({ lat: 50.8466, lng: 4.3528 });

  // Update Geolocation in state every .5sec
 useEffect(() => {
      function handleSuccess(pos) {
        var newGeoloc = pos.coords;
        setGeoloc({lat: newGeoloc.latitude, lng: newGeoloc.longitude});
      }
      const handleError = (error) => {
        console.log(error.message);
      };
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError);
    return () => navigator.geolocation.clearWatch(watchId);
  }, [])

  return (
    <div className="map-container">
      <OsmMap
        center={[geoloc.lat, geoloc.lng]}
        zoom={20}
        onclick={handleClickOnMap}
        style={{ width: '100%', height: '100%'}} >
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        <Marker
          position={[geoloc.lat, geoloc.lng]}
          icon={customMarkerIcon}
        />

        <Circle
          radius={30}
          center={[geoloc.lat, geoloc.lng]}
          color={`red`}
          weight={0}
          fillColor={`#f03`}
          fillOpacity={`0.2`} />
      </OsmMap>
    </div>
  );
}

export default Map;