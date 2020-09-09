import React, { useContext } from 'react';
import Header from '../components/Header.js';
import Map from '../components/Map.js';
import Contexts from '../contexts/Contexts.js';

function Trail(props) {

  // -----------------------
  // CONTEXTS
  // -----------------------
  
    const { myContext, setMyContext } = useContext(Contexts);

    // If user is not in Context -> Redriect to home
    // else -> Set user & role
    let user = null;
    let role = null;
    if( myContext.user.name === undefined || myContext.user.role === undefined ) {
        window.location.href = '/';
    } else {
        user = myContext.user.name;
        role = myContext.user.role;
    }

  // -----------------------
  // PROPS
  // -----------------------

  let trail = undefined;
  if( role === "player") trail = props.location.state.trail;

  // console.log(props.location.state);
  return (
      <>
      <Header title={`Parcours`} />
      <main className="no-pad">
          <Map trail={trail !== undefined ? trail : undefined} />
      </main>
      </>
  );
}

export default Trail;