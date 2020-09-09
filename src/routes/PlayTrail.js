import React from 'react';
import Header from '../components/Header.js';
import PlayMap from '../components/PlayMap.js'

function PlayTrail(props) {

    console.log(props.location.state);
  return (
      <>
      <Header title={`Nouveau parcours`} />
      <main className="no-pad">
          {props.location.state !== undefined &&
          <PlayMap trail={props.location.state.trail} userType={props.location.state.userType} />
            }
      </main>
      </>
  );
}

export default PlayTrail;