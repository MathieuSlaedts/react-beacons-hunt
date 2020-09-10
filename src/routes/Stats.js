import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import Header from '../components/Header.js';
import { Link } from "react-router-dom";
import Contexts from '../contexts/Contexts.js';
import { useHistory } from "react-router-dom";

function Stats(props) {

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
    // PROPS
    // -----------------------

    const trail = props.location.state.trail;

    // -----------------------
    // METHODS
    // -----------------------

    const formatDates = (date) => {
        var d = new Date(parseInt(date));
        return d.toLocaleDateString("fr-FR", {month: "short", day: 'numeric', hour: "2-digit", minute: "2-digit", second: "2-digit"});
    }

    const questDuration = (quest) => {
          const s = parseInt(quest.start);
          const e = parseInt([...quest.beacons].pop().time);
          const timeElaps = Math.floor((e - s) / 1000);
          quest.duration = timeElaps;
          return quest;
      };

    const arangeQuests = (newQuests) => {
        if( newQuests !== undefined ) {
            newQuests = newQuests.filter(el => el.trail_id === trail.trail_id);
            newQuests = newQuests.map(el => questDuration(el));
            newQuests = newQuests.sort((a, b) => a.duration - b.duration);
            setQuests(newQuests);
        }
    }

    const fetchQuests = async () => {
        console.log("in fetch");
        const url = rUrl + 'quests';
        try {
            const resp = await Axios.get( url );
            return resp.data;
        } catch (err) { console.error(err); }
    };

    // -----------------------
    // STATS
    // -----------------------
    
    const [quests, setQuests] = useState([]);

    // -----------------------
    // EFFETCS
    // -----------------------

    // Effect happens on Mount
    useEffect( () => {
        console.log("in effect");
        ( async () => {
            let newQuests = await fetchQuests();
            arangeQuests(newQuests);
        })();
    // eslint-disable-next-line
    }, []);

    // -----------------------
    // RENDER
    // -----------------------
    
    return (
      <>
      <Header title={`Statistiques`} />
      <main>
        <div className="container">

        <h2>Parcours: {trail.name}</h2>

            {quests.length === 0 && <p>No result</p>}
            {quests.length > 0 &&
            <table className="stats">
                <thead>
                    <tr>
                        <th>Place</th>
                        <th>Participant</th>
                    </tr>
                </thead>
                <tbody>
                    {quests.map((el,index) => (
                    <tr key={el.quest_id}>
                        <td><p>{index+1}</p></td>
                        <td>
                            <p>{el.player_name !== null ? el.player_name : el.player_id}</p>
                            <p>-</p>
                            <p>Durée: {el.duration} sec.</p>
                            <p>Démarrage: {formatDates(el.start)}</p>
                            <p>Dernier beacon attrapé: {formatDates(el.beacons.slice(-1)[0].time)}</p>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            }

            <Link
            to={{ pathname: "/trails" }}
            className="button is-link">Retour aux parcours</Link>
        </div>
      </main>
      </>
  );
}

export default Stats;
