import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import uid from 'uid';
import Header from '../components/Header.js'

function Trails() {

    const [trails, setTrails] = useState([]);

    const fetchDatas = async () => {
        const url = 'http://localhost:1337/trails';
        try {
            const resp = await Axios.get( url );
            return resp.data;
        } catch (err) { console.error(err); }
    };

    const postTrail = async (trail) => {
        console.log("post trail");
        const url = 'http://localhost:1337/trails';
        try {
            const resp = await Axios.post( url, trail );
            //return resp.data;
        } catch (err) { console.error(err); }
    };

    const handleAddNewTrail = (ev) => {
        ev.preventDefault();
        console.log("add new trail");
        const newtrail = {
            trail_id: uid(),
            name: "My new Trail",
            becoins: [
                { becoin_id: uid(), lat: 50.8243, lng: 4.38075 }
            ]
        };
        postTrail(newtrail);
    };

    useEffect( () => {
        ( async () => {
            const newTrails = await fetchDatas();
            setTrails(newTrails);
        })();
    // eslint-disable-next-line
    }, []);


console.log(trails);
  return (
      <>
      <Header title={`Parcours`} />
      <main>
        <div className="container">
            <button
                onClick={handleAddNewTrail}
                className="add-trail-btn button is-link"
            >Créer un nouveau parcours</button>

            <ul className="trails">

                {trails.map((el, index) => (
                <li key={el.trail_id} className="trail">
                    <p>{el.name} <span className="tag is-warning">Inactif</span></p>
                    <button className="button">Jouer</button>
                    <button className="button">Stats</button>
                </li>
                ))}
            </ul>
        </div>
      </main>
      </>
  );
}

export default Trails;
