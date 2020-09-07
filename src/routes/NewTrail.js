import React from 'react';
import Header from '../components/Header.js';
import Map from '../components/Map.js'

function NewTrail() {
  return (
      <>
      <Header title={`Nouveau parcours`} />
      <main className="no-pad">
          <Map />
      </main>
      </>
  );
}

export default NewTrail;