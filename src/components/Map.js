import React, { useState, useEffect } from 'react';
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { Map as OsmMap, Marker, Popup, Circle, TileLayer } from 'react-leaflet';

function Map(props) {

  // From https://www.geodatasource.com/developers/javascript
  function getDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  // Customize Icon Marker
  const customMarkerUserPos = divIcon({
    html: renderToStaticMarkup(<span className="custom-marker custom-marker-user-pos" />)
  });
  const customMarkerBeacon = divIcon({
    html: renderToStaticMarkup(<span className="custom-marker custom-marker-beacon" />)
  });

  // Hanle click on map
  const handleClickOnMap = (ev) => {
    console.log("click on map", ev.latlng);
    const { lat, lng } = ev.latlng;
    setBeacons(prevBeacons => [...prevBeacons, {lat: lat, lng: lng}]);
  };

  // Hanle click on map
  // Todo: remove the beacon if create trail
  const handleClickOnBeacon = (ev) => {
    console.log("click on beacon");
  };

  // State - geolocation
  const [geoloc, setGeoloc] = useState({ lat: 50.824257682060185, lng: 4.381259679794312 });
  const [beacons, setBeacons] = useState([{lat: 20, lng: 2}, {lat: 50.82424073851184, lng: 4.381710290908814}]);

  // Update Geolocation in state every .5sec
 useEffect(() => {
      function handleSuccess(pos) {
        var newGeoloc = pos.coords;
        setGeoloc({lat: newGeoloc.latitude, lng: newGeoloc.longitude});

        beacons.forEach((el,index) => {
          const dist = getDistance(geoloc.lat, geoloc.lng, el.lat, el.lng, 'K');
          if(dist < 0.035) {console.log("beacon: ", index)}
        });
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
        zoom={17}
        onclick={handleClickOnMap}
        style={{ width: '100%', height: '100%'}} >
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        <Marker
          position={[geoloc.lat, geoloc.lng]}
          icon={customMarkerUserPos}
        />

        {beacons.map((el, index) => (
          <Marker
          key={index}
          position={[el.lat, el.lng]}
          icon={customMarkerBeacon}
          onclick={handleClickOnBeacon}
        />
        ))}

        {/* <Circle
          radius={30}
          center={[geoloc.lat, geoloc.lng]}
          color={`red`}
          weight={0}
          fillColor={`#f03`}
          fillOpacity={`0.2`} /> */}
      </OsmMap>
    </div>
  );
}

export default Map;