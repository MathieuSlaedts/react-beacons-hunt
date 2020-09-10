import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import uid from 'uid';
import { Link } from "react-router-dom";
import Header from '../components/Header.js'
import Contexts from '../contexts/Contexts.js'
import { useHistory } from "react-router-dom";

function Trails() {

    // -----------------------
    // REACT ROUTER HISTORY
    // -----------------------
    
    const history = useHistory();

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
    // METHODS
    // -----------------------

    const fetchTrails = async () => {
        const url = rUrl + 'trails';
        try {
            const resp = await Axios.get( url );
            return resp.data;
        } catch (err) { console.error(err); }
    };

    const postTrail = async (trail) => {
        console.log("post trail");
        const url = rUrl + 'trails';
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

    const handleChangeRole = async (ev) => {
        ev.preventDefault();
    
        let newContext = {...myContext};
          newContext.user = {
            name: user,
            role:  role === "player" ? "builder" : "player"
          }
        setMyContext(newContext);
    };

    // -----------------------
    // STATES
    // -----------------------

    const [trails, setTrails] = useState([]);

    // -----------------------
    // EFFETCS
    // -----------------------

    useEffect( () => {
        ( async () => {
            const newTrails = await fetchTrails();
            setTrails(newTrails);
        })();
    // eslint-disable-next-line
    }, []);


    console.log(myContext.user, user, role);
    return (
        <>
        <Header title={`Parcours`} />
            <main className={role !== null && role !== undefined ? role : undefined}>
                <div className="container">
                    
                    { role === "builder" &&
                    <Link 
                        to={{ pathname: "trail" }}
                        className="add-trail-btn button is-link">Créer un nouveau parcours</Link>
                    }
                    
                    <ul className="trails">
                        
                        {trails.map((el, index) => (
                            <li key={el.trail_id} className="trail">
                                <p>{el.name}{/*role === "builder" && <span className="tag is-warning">Inactif</span>*/}</p>
                                <div>
                                    
                                    { role === "builder" &&
                                        <button className="button" disabled>Editer</button>
                                    }
                                    
                                    { role === "player" &&
                                    <Link
                                    to={{ pathname: "/trail", state: { trail: el } }}
                                    className="button">Jouer</Link>
                                    }
                                    
                                    <Link
                                    to={{ pathname: "/Stats", state: { trail: el } }}
                                    className="button">Stats</Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button className="button is-link" onClick={handleChangeRole}>Changer de role</button>
                </div>
            </main>
      </>
  );
}

export default Trails;
