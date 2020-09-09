import React, { useState, useEffect, useRef } from 'react';
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { Map as OsmMap, Marker, /* Popup, Circle, */ TileLayer } from 'react-leaflet';
import uid from 'uid';
import Axios from 'axios';
import { useHistory } from "react-router-dom";

function PlayMap(props) {

    // -----------------------
    // PROPS
    // -----------------------

    const userType = props.userType;
    const initialTrail = props.trail;
    const initialBeacons = userType === "player" ? initialTrail.beacons : [];

    // -----------------------
    // REFS
    // -----------------------
    
    const newTrailNameFld = useRef();

    // -----------------------
    // REACT ROUTER HISTORY
    // -----------------------
    
    const history = useHistory();

    // -----------------------
    // CUSTOMIZE ICON MARKERs
    // -----------------------
    
    const customMarkerUserPos = divIcon({
      html: renderToStaticMarkup(<span className="custom-marker custom-marker-user-pos" />)
    });
    const customMarkerBeacon = (id) => {
      return divIcon({ html: renderToStaticMarkup(<span id={id} className="custom-marker custom-marker-beacon" />) })
    };

    // -----------------------
    // FOR PLAYER
    // -----------------------

  // From https://www.geodatasource.com/developers/javascript
  function getDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
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
      if (unit==="K") { dist = dist * 1.609344 }
      if (unit==="N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  const addBeaconToQuest = (id) => {
    let catchedBeacon = [...beacons].filter(newBeacon => newBeacon.beacon_id === id).shift();
    let newQuest = {...quest}
    newQuest.beacons.push({...catchedBeacon, time: Date.now()});
    setQuest(newQuest);
  };

  const setStartTimeQuest = () => {
    let newQuest = {...quest}
    newQuest.start = Date.now();
    if(userType === "player") newQuest.trail_id = initialTrail.trail_id;
    setQuest(newQuest);
  };

  const handleNoBeacon = () => {
    if( beacons.length === 0 ) {
      console.log("WIN", quest);
      postQuest(quest);
    }
  };

  const postQuest = async (quest) => {
      console.log(quest);
      const url = 'http://localhost:1337/quests';
      try {
          const resp = await Axios.post( url, quest );
          //return resp.data;
      } catch (err) { console.error(err); }
  };

  // -----------------------
  // FOR BUILDER
  // -----------------------

  // Hanle click on Map
  const handleClickOnMap = (ev) => {
    //console.log("click on map", ev.latlng);
    const { lat, lng } = ev.latlng;
    setBeacons(prevBeacons => [...prevBeacons, {beacon_id: uid(), lat: lat, lng: lng}]);
  };

  const postTrail = async (trail) => {
      console.log("post trail");
      const url = 'http://localhost:1337/trails';
      try {
          const resp = await Axios.post( url, trail );
          //return resp.data;
      } catch (err) { console.error(err); }
  };

  const handleTrailValidation = (ev) => {
      ev.preventDefault();
      console.log("add new trail");
      const newtrail = {
          trail_id: uid(),
          name: newTrailNameFld.current.value,
          beacons: beacons
      };
      postTrail(newtrail);
      history.push("/trails");
  };

  // -----------------------
  // FOR PLAYER & BUILDER
  // -----------------------

  const deleteBeacon = (id) => {
    const newBeacons = [...beacons].filter(newBeacon => newBeacon.beacon_id !== id);
    setBeacons([...newBeacons]);
  };

  // -----------------------
  // FOR TEST
  // -----------------------

  // Hanle click on Beacon / Marker
  const handleClickOnBeacon = (ev) => {
    const beaconId = ev.originalEvent.srcElement.id;
    addBeaconToQuest(beaconId);
    deleteBeacon(beaconId);
  };

  // -----------------------
  // STATES
  // -----------------------

  const [quest, setQuest] = useState({
        quest_id: uid(),
        trail_id: "",
        player_id: "cetidnefonctionnepasencore",
        start: Date.now(),
        beacons: []
  });
  const [geoloc, setGeoloc] = useState({ lat: 50.824257682060185, lng: 4.381259679794312 });
  const [beacons, setBeacons] = useState(initialBeacons);

  // -----------------------
  // EFFECTS
  // -----------------------


// Effect happens on Mount
 useEffect(() => {

      // Set Quest Start time
      setStartTimeQuest();

      // Set and Update Geolocation
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



  // Check if there is beacons
  // Effect happens when beacons is updated
  useEffect(() => {
    if( userType === "player") {
        handleNoBeacon();
    }
  // eslint-disable-next-line
  }, [beacons])



    // Check distance between user and beacons
    // Effetc happens when geoloc is updates
    
    useEffect(() => {
        if( userType === "player") {
        beacons.forEach((el,index) => {
            const dist = getDistance(geoloc.lat, geoloc.lng, el.lat, el.lng, 'K');
            if(dist < 0.035) { console.log("whoot"); deleteBeacon(el.beacon_id); }
        });
    }
    // eslint-disable-next-line
    }, [geoloc])


//console.log(quest);
//console.log(initialBeacons);
//console.log(beacons);
  return (
    <div className="map-container">
      <OsmMap
        center={[geoloc.lat, geoloc.lng]}
        zoom={17}
        onClick={ (ev) => { userType === 'builder' && handleClickOnMap(ev) }}
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
          key={index+'_'+el.beacon_id}
          position={[el.lat, el.lng]}
          icon={customMarkerBeacon(el.beacon_id)}
          onclick={handleClickOnBeacon}
        />
        ))}
      </OsmMap>
      <div className="footer">
        {userType === "player" &&
            <p>Reamaining beacons: {beacons.length}</p>
        }
        {userType === "builder" &&
            <form onSubmit={handleTrailValidation}>
              <input className="input" type="text" placeholder="Nom du trail" ref={newTrailNameFld} />
              <button className="button">Creer</button>
            </form>
        }
      </div>
    </div>
  );
}

export default PlayMap;