import React, { useState, useEffect } from 'react';
import { Map as OsmMap, Marker, Popup, Circle, TileLayer } from 'react-leaflet'

function Map(props) {

  const handleClick = (ev) => {
    console.log(ev.latlng);
  };

  const [geoloc, setGeoloc] = useState({ lat: 50.8466, lng: 4.3528 });

    useEffect(() => {
      const interval = setInterval(() => {
        function success(pos) {
          var newGeoloc = pos.coords;
          setGeoloc({lat: newGeoloc.latitude, lng: newGeoloc.longitude});
          //console.log(newGeoloc);
        }
        navigator.geolocation.getCurrentPosition(success);
      }, 1000);
      return () => clearInterval(interval);
    }, [])

  return (
    <div className="map-container">
      <OsmMap
        center={[geoloc.lat, geoloc.lng]}
        zoom={15}
        onclick={handleClick}
        style={{ width: '100%', height: '100%'}} >
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        <Circle
          radius={300}
          center={[geoloc.lat, geoloc.lng]}
          color={`red`}
          fillColor={`#f03`}
          fillOpacity={`0.5`} />
      </OsmMap>
    </div>
  );
}

export default Map;