import React, { useState, useEffect } from 'react';
import { Map as OsmMap, /* Marker, Popup, Circle, */ TileLayer } from 'react-leaflet';
import BeaconMarker from '../components/map/BeaconMarker.js';
import UserMarker from '../components/map/UserMarker.js';

function Map({beacons = [], mapClicked, beaconCaptured}) {

  // -----------------------
  // STATES
  // -----------------------
  
  const [userLoc, setUserLoc] = useState([]);
  
  // -----------------------
  // HANDLERS
  // -----------------------

  const handleClickOnMap = (ev) => {
    mapClicked(ev.latlng);
  };

  const handleClickOnBeacon = (beaconId) => {
    beaconCaptured(beaconId);
  }
  
  // -----------------------
  // METHODS
  // -----------------------

  // From https://www.geodatasource.com/developers/javascript
  function getDistance( lat1, lon1, lat2, lon2 ) {
    if ((lat1 === lat2) && (lon1 === lon2)) { return 0; }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) { dist = 1; }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI * 60 * 1.1515 * 1.609344;
      return dist;
    }
  }

  // -----------------------
  // EFFECTS
  // -----------------------
  
  // Effect happens on Mount
  // Set and Update User Geolocation
  useEffect(() => {
    const handleSuccess = (pos) => {
      setUserLoc([pos.coords.latitude, pos.coords.longitude]);
    }
    const handleError = (error) => { console.log(error.message); };
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError);
    return () => navigator.geolocation.clearWatch(watchId);
  }, [])

  // Effect happens when geoloc is updates
  // Capture Beacon if User is closer than 10m from beacon
  useEffect(() => {
    beacons.forEach((el,index) => {
      const dist = getDistance( userLoc[0], userLoc[1], el.lat, el.lng );
      if(dist < 0.015) { beaconCaptured(el.beacon_id); }
    });
  // eslint-disable-next-line
  }, [userLoc])
  
  // -----------------------
  // RENDER
  // -----------------------
  
  return (
     <>
     {userLoc.length > 0 &&
    <div className="map-container">
      <OsmMap
        center={userLoc}
        zoom={17}
        onClick={handleClickOnMap}
        style={{ width: '100%', height: '100%'}} >
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        
        <UserMarker position={userLoc} />

        {beacons.length > 0 && beacons.map((el, index) => (
          <BeaconMarker
          key={el.beacon_id}
          id={el.beacon_id}
          position={[el.lat, el.lng]}
          handleClickOnBeacon={handleClickOnBeacon}
          />
        ))}
      </OsmMap>
    </div>
    }
    </>
  );
}

export default Map;