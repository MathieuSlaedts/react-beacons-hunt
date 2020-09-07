import React from 'react';
import Header from '../components/Header.js'

function Trails() {
  return (
      <>
      <Header title={`Parcours`} />
      <main>
        <div className="container">
            <button className="add-trail-btn button is-link">Créer un nouveau parcours</button>

            <ul className="trails">
                <li className="trail">
                    <p>Nom du parcours <span className="tag is-warning">Inactif</span></p>
                    <button className="button">Jouer</button>
                    <button className="button">Stats</button>
                </li>
                <li className="trail">
                    <p>Nom du parcours <span class="tag is-warning">Inactif</span></p>
                    <button className="button">Jouer</button>
                    <button className="button">Stats</button>
                </li>
                <li className="trail">
                    <p>Nom du parcours <span class="tag is-warning">Inactif</span></p>
                    <button className="button">Jouer</button>
                    <button className="button">Stats</button>
                </li>
            </ul>
        </div>
      </main>
      </>
  );
}

export default Trails;
