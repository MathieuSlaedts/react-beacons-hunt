import React, { useState, useRef, useContext } from 'react';
import Axios from 'axios';
import uid from 'uid';
import Context from '../contexts/Context.js';
import { useHistory } from "react-router-dom";
import useUserHook from '../hooks/useUserHook.js';

import Header from '../components/Header.js';
import Map from '../components/Map.js';

function CreateTrail(props) {

  // -----------------------
  // REACT ROUTER HISTORY
  // -----------------------
    
  const history = useHistory();

  // -----------------------
  // HOOKS
  // -----------------------
  
  const {user, role} = useUserHook();

  // -----------------------
  // CONTEXTS
  // -----------------------
  
    const { context } = useContext(Context);
    const requestURL = context.requestURL[context.ENV];

  // -----------------------
  // REFS
  // -----------------------
    
  const newTrailNameFld = useRef();

  // -----------------------
  // STATES
  // -----------------------

  const [beacons, setBeacons] = useState([]);

  // -----------------------
  // METHODS
  // -----------------------

  // This is coming from child Map.js
  // add a new beacon to beacons (state)
  const mapClicked = (pos) => {
    const { lat, lng } = pos;
    setBeacons(prevBeacons => [...prevBeacons, {beacon_id: uid(), lat: lat, lng: lng}]);
  };

  const publishTrail = async (ev) => {
    ev.preventDefault();
    const newTrail = {
        trail_id: uid(),
        name: newTrailNameFld.current.value,
        beacons: beacons
    };
    console.log(newTrail);
    await postTrail(newTrail);
    history.push("/trails");
  };

  // -----------------------
  // AXIOS REQUESTS
  // -----------------------

  // Axios request -> Add a Trail in the DB
  const postTrail = async (trail) => {
    try { const resp = await Axios.post( requestURL + 'trails', trail ); }
    catch (err) { console.error(err); }
  };

  // -----------------------
  // RENDER
  // -----------------------

  return (
    <>
      <Header title={`Parcours`} />
      <main className="no-pad">
            <Map
              beacons={beacons}
              mapClicked={mapClicked}
            />
            <form className="create-trail-form" onSubmit={publishTrail}>
              <input className="input" type="text" placeholder="Nom du trail" ref={newTrailNameFld} />
              <button className="button">Creer</button>
            </form>
      </main>
    </>
  );
}

export default CreateTrail;