import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import Context from '../contexts/Context.js';
import Axios from 'axios';
import Header from '../components/Header.js';
import useUserHook from '../hooks/useUserHook.js';

function Trails() {

    // -----------------------
    // HOOKS
    // -----------------------
    
    const {user, role} = useUserHook();

    // -----------------------
    // CONTEXTS
    // -----------------------
  
    const { context, setContext } = useContext(Context);
    const requestURL = context.requestURL[context.ENV];

    // -----------------------
    // STATES
    // -----------------------

    const [trails, setTrails] = useState([]);

    // -----------------------
    // METHODS
    // -----------------------

    const handleChangeRole = async (ev) => {
        ev.preventDefault();
    
        let newContext = {...context};
          newContext.user = {
            name: user,
            role:  role === "player" ? "builder" : "player"
          }
          setContext(newContext);
    };

    // -----------------------
    // AXIOS REQUEST
    // -----------------------

    const fetchTrails = async () => {
        try {
            const resp = await Axios.get( requestURL + 'trails' );
            return resp.data;
        } catch (err) { console.error(err); }
    };

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
    
    return (
        <>
        <Header title={`Parcours`} />
            <main className={role !== null && role !== undefined ? role : undefined}>
                <div className="container">
                    
                    { role === "builder" &&
                    <Link 
                        to={{ pathname: "create-trail" }}
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
                                    to={{ pathname: "/play-trail", state: { trail: el } }}
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
