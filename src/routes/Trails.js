import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import uid from 'uid';
import { Link } from "react-router-dom";
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
            beacons: [
                { beacon_id: uid(), lat: 50.8243, lng: 4.38075 },
                { beacon_id: uid(), lat: 50.82476598565123, lng: 4.380776882171632 },
                { beacon_id: uid(), lat: 50.82391880992506, lng: 4.380873441696168 },
                { beacon_id: uid(), lat: 50.82384425772526, lng: 4.382236003875733 },
                { beacon_id: uid(), lat: 50.82418313040149, lng: 4.381710290908814 }
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
            {/* <button
                onClick={handleAddNewTrail}
                className="add-trail-btn button is-link"
            >Créer un nouveau parcours</button> */}
                    <Link 
                        to={{
                            pathname: "/play-trail",
                            state: {
                                userType: "builder"
                            }
                        }}
                        className="add-trail-btn button is-link">Créer un nouveau parcours</Link>

            <ul className="trails">

                {trails.map((el, index) => (
                <li key={el.trail_id} className="trail">
                    <p>{el.name} <span className="tag is-warning">Inactif</span></p>
                    <div>
                    <button className="button" disabled>Editer</button>
                    <Link 
                        to={{
                            pathname: "/play-trail",
                            state: {
                                trail: el,
                                userType: "player"
                            }
                        }} 
                        className="button">Jouer</Link>
                    <button className="button">Stats</button>
                    </div>
                </li>
                ))}
            </ul>
        </div>
      </main>
      </>
  );
}

export default Trails;
