import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import uid from 'uid';
import Context from '../contexts/Context.js';
import { useHistory } from "react-router-dom";
import useUserHook from '../hooks/useUserHook.js';

import Header from '../components/Header.js';
import Map from '../components/Map.js';
import TakePicture from '../components/camera/TakePicture.js';

/*
*
* When a Beacon is clicked, Maps.je call beaconCaptured
* beaconCaptured call updatePlayedBeacon
* updatePlayedBeacon update playedBeacon
* UseEffet listen to playedBeacon
* If picture source is not set, lauch camera
* else call removeFromRemainingBeacons & addToCapturedBeacons
* removeFromRemainingBeacons remove playedBeacon from remainingBeacons
* addToCapturedBeacons add playedBeacon to capturedBeacons
* useEffect listen to capturedBeacons and call updateQuest if there are no remaining beacons
* useEffect listen to updateQuest and call playerWin
*
*/

function PlayTrail(props) {

    // -----------------------
    // REACT ROUTER HISTORY
    // -----------------------
      
    const history = useHistory();

    // -----------------------
    // HOOKS
    // -----------------------
    
    const { user, role } = useUserHook();

    // -----------------------
    // CONTEXTS
    // -----------------------
  
    const { context } = useContext(Context);
    const requestURL = context.requestURL[context.ENV];

    // -----------------------
    // PROPS
    // -----------------------
  
    let trail = undefined;
    if(Object.keys(props.location.state.trail).length) {
      trail = props.location.state.trail;
    } else {
      trail = context.ENV_DEV.trail;
    };
    

    // -----------------------
    // STATES
    // -----------------------
    
    const [remainingBeacons, setRemainingBeacons] = useState(trail.beacons);
    const [playedBeacon, setPlayedBeacon] = useState({});
    const [capturedBeacons, setCapturedBeacons] = useState([]);
    const [showCamera, setShowCamera] = useState(false);
    const [quest, setQuest] = useState({
        quest_id: uid(),
        trail_id: trail.trail_id,
        player_name: user,
        player_id: "fakeid-"+uid(),
        start: Date.now(),
        beacons: []
  });
  /* const [newBeacon, setNewBeacon] = useState({}); */

    // -----------------------
    // METHODS
    // -----------------------

    // This is coming from child Map.js
    const beaconCaptured = (id) => {
        updatePlayedBeacon(id);
    };

    // Delete captured beacon from remainingBeacons (state)
    const removeFromRemainingBeacons = (beacon) => {
        const beacons = [...remainingBeacons].filter(newBeacon => newBeacon.beacon_id !== beacon.beacon_id);
        setRemainingBeacons([...beacons]);
    };

    // Update played beacon to playedBeacon (state)
    // This step is neccessary in ordre to go trough to camera / Maybe logic can be better
    const updatePlayedBeacon = (id) => {
        let beacon = [...remainingBeacons].filter(newBeacon => newBeacon.beacon_id === id).shift();
        beacon = {...beacon, time:Date.now(), picture:"" };
        setPlayedBeacon(beacon);
    };
    
    // Add captured beacon to capturedBeacons (state)
    const addToCapturedBeacons = (beacon) => {
      // This prevent a first empty entry in the playedBeacon array
      const beacons = capturedBeacons.length > 0 ? [...capturedBeacons, beacon] : [beacon];
      setCapturedBeacons(beacons);
    };

    // Show / Hide camera
    const swichShowCamera = () => {
      setShowCamera(!showCamera);
    };

    // Add the picture src to playedBeacon
    const pictureTaken = (dataUri) => {
      swichShowCamera();
      let beacon = {...playedBeacon}
      beacon.picture = dataUri;
      setPlayedBeacon(beacon);
    }

    // Update catched beacons to Quest (state)
    const updateQuest = () => {
      let newQuest = {...quest, beacons: [...capturedBeacons]};
      setQuest(newQuest);
    };

  // Player Win
  const playerWin = async () => {
    await postQuest(quest);
    history.push({ pathname: "/Stats", state: { trail: trail, currentQuest: quest.quest_id } });
  };

    // -----------------------
    // AXIOS REQUESTS
    // -----------------------

    // Add finished Quest to the DB
    const postQuest = async (quest) => {
        try { const resp = await Axios.post( requestURL + 'quests', quest ); }
        catch (err) { console.error(err); }
    };

    // -----------------------
    // EFFECTS
    // -----------------------

    // Effect happens when playedBeacon is updated
    // Update win (state) to true if there is no remaining beacon
    useEffect(() => {
      if(Object.keys(playedBeacon).length) {
        if(playedBeacon.picture === "") {
          setShowCamera(!showCamera);
        } else {
          removeFromRemainingBeacons(playedBeacon);
          addToCapturedBeacons(playedBeacon);
        }
      }
    // eslint-disable-next-line
    }, [playedBeacon])

    // Effect happens when capturedBeacons is updated
    // Update win (state) to true if there is no remaining beacon
    useEffect(() => {
        if( remainingBeacons.length === 0 ) { updateQuest(); }
    // eslint-disable-next-line
    }, [capturedBeacons])

    // Effect happens when quest is updated
    // Player Win
    useEffect(() => {
      if( quest.beacons.length > 0 ) { playerWin(); }
    // eslint-disable-next-line
    }, [quest])

    // -----------------------
    // RENDER
    // -----------------------

    return (
        <>
            <Header title={`Parcours`} />
            <main className="no-pad">
                <Map
                    beacons={remainingBeacons}
                    mapClicked={()=>{}}
                    beaconCaptured={beaconCaptured}
                />
                <div className="remaining-beacons">Remaining beacons: {remainingBeacons.length}</div>
                { showCamera === true && <TakePicture pictureTaken={pictureTaken} /> }
            </main>
      </>
    );
}

export default PlayTrail;