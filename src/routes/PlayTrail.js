import React from 'react';
import Header from '../components/Header.js';
import PlayMap from '../components/PlayMap.js'

function PlayTrail() {
  return (
      <>
      <Header title={`Nouveau parcours`} />
      <main className="no-pad">
          <PlayMap />
      </main>
      </>
  );
}

export default PlayTrail;