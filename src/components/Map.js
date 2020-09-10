import React, { useContext, useState, useEffect, useRef } from 'react';
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { Map as OsmMap, Marker, /* Popup, Circle, */ TileLayer } from 'react-leaflet';
import uid from 'uid';
import Axios from 'axios';
import { useHistory } from "react-router-dom";
import Contexts from '../contexts/Contexts.js';
import TakePicture from '../components/camera/TakePicture.js';

function Map(props) {

  // -----------------------
  // CONTEXTS
  // -----------------------

  const { myContext, setMyContext } = useContext(Contexts);
  let user = null;
  let role = null;
  if( myContext.user.name === undefined || myContext.user.role === undefined ) {
      window.location.href = '/';
  } else {
      user = myContext.user.name;
      role = myContext.user.role;
  }
    
  const rUrl = (myContext.rUrl[myContext.env]);

  // -----------------------
  // PROPS
  // -----------------------

  // userType is useless & should be replaced by role a next refactoring
  const userType = role;
  let initialTrail = "";
  let initialBeacons = [];
  if(role === "player") {
    initialTrail = props.trail;
    initialBeacons = initialTrail.beacons;
  }

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
  // METHODS
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

  // Player Win
  const playerWin = async () => {
    await postQuest(quest);
    history.push({
      pathname: "/Stats",
      state: { trail: initialTrail, }
    });
  };

  // Axios request
  // -> Add a Quest in the DB
  const postQuest = async (quest) => {
    try { const resp = await Axios.post( rUrl + 'quests', quest ); }
    catch (err) { console.error(err); }
  };

  // -----------------------
  // FOR BUILDER
  // -----------------------

  // Hanle click on Map
  // -> Update Beacons in state: add a new beacon
  const handleClickOnMap = (ev) => {
    const { lat, lng } = ev.latlng;
    setBeacons(prevBeacons => [...prevBeacons, {beacon_id: uid(), lat: lat, lng: lng}]);
  };

  // Axios request
  // -> Add a Trail in the DB
  const postTrail = async (trail) => {
      try { const resp = await Axios.post( rUrl + 'trails', trail ); }
      catch (err) { console.error(err); }
  };

  const handleTrailValidation = async (ev) => {
      ev.preventDefault();
      console.log("add new trail");
      const newtrail = {
          trail_id: uid(),
          name: newTrailNameFld.current.value,
          beacons: beacons
      };
      await postTrail(newtrail);
      history.push("/trails");
  };

  // -----------------------
  // FOR PLAYER & BUILDER
  // -----------------------

  const captureBeacon = (beaconId) => {
    createNewBeacon(beaconId);
    updateRemainingBeacons(beaconId);
  };

  const takePicture = () => {
    swichShowCamera();
  }

  const pictureTaken = (dataUri) => {
    console.log(win);
    swichShowCamera();
    // let catchedBeacon = {...newBeacon, picture: dataUri}
    const catchedBeacon = {...newBeacon};
    let newQuest = {...quest}
    newQuest.beacons.push(catchedBeacon);
    setQuest(newQuest);
    if(win === true ) { 
      
      playerWin();
    }
  }

  // Update the state - quest -> Add captured beacon
  const createNewBeacon = (beaconId) => {
    let catchedBeacon = [...beacons].filter(newBeacon => newBeacon.beacon_id === beaconId).shift();
    catchedBeacon = {...catchedBeacon, time:Date.now() };
    setNewBeacon(catchedBeacon); console.log("new Beacon: ", catchedBeacon);
    takePicture();
  };

  // Update state - beacons -> Delete captured beacon
  const updateRemainingBeacons = (id) => {
    const newBeacons = [...beacons].filter(newBeacon => newBeacon.beacon_id !== id);
    setBeacons([...newBeacons]);
  };

  // -----------------------
  // FOR TEST
  // -----------------------

  const handleClickOnBeacon = (ev) => {
    const beaconId = ev.originalEvent.srcElement.id;
    captureBeacon(beaconId);
  };

  const swichShowCamera = () => {
    setShowCamera(!showCamera);
  };

  // -----------------------
  // STATES
  // -----------------------

  const [quest, setQuest] = useState({
        quest_id: uid(),
        trail_id: initialTrail.trail_id,
        player_name: user,
        player_id: "fakeid-"+uid(),
        start: Date.now(),
        beacons: []
  });
  const [geoloc, setGeoloc] = useState({ lat: 50.824257682060185, lng: 4.381259679794312 });
  const [beacons, setBeacons] = useState(initialBeacons);
  const [newBeacon, setNewBeacon] = useState({});
  const [showCamera, setShowCamera] = useState(false);
  const [win, setWin] = useState(false);

  // -----------------------
  // EFFECTS
  // -----------------------


  // Effect happens on Mount
  useEffect(() => {

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

  // Effect happens when beacons is updated
  useEffect(() => {
    if( userType === "player" && beacons.length === 0 ) {
        setWin(true);
    }
  // eslint-disable-next-line
  }, [beacons])

  // Effect happens when geoloc is updates
  useEffect(() => {
    if( userType === "player") {
      // Capture beacon
      beacons.forEach((el,index) => {
        const dist = getDistance(geoloc.lat, geoloc.lng, el.lat, el.lng, 'K');
        if(dist < 0.035) { captureBeacon(el.beacon_id); }
      });
    }
  // eslint-disable-next-line
  }, [geoloc])

  // -----------------------
  // RENDER
  // -----------------------

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
      { showCamera === true && <TakePicture pictureTaken={pictureTaken} /> }
    </div>
  );
}

export default Map;