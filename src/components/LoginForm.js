import React, { useContext, useRef } from 'react';
import Context from '../contexts/Context.js';
import { useHistory } from "react-router-dom";

function LoginForm() {

  // -----------------------
  // REACT ROUTER HISTORY
  // -----------------------
  
  const history = useHistory();

  // -----------------------
  // CONTEXTS
  // -----------------------

  const { context, setContext } = useContext(Context);

  // -----------------------
  // REFS
  // -----------------------
  
  const nameFld = useRef();
  const roleFld = useRef();

  // -----------------------
  // METHODS
  // -----------------------

  const handleSubmit = (ev) => {
    ev.preventDefault();
    
    let newContext = {...context};
      newContext.user = {
        name: nameFld.current.value,
        role: roleFld.current.value
      }
      setContext(newContext);
    history.push("/trails");
  }

  // -----------------------
  // RENDER
  // -----------------------

  return (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Nom d'utilisateur:</label>
              <input className="input" type="text" placeholder="Nom d'utilisateur" ref={nameFld} />
            </div>
            <div className="field">
              <label className="label">Votre role:</label>
              <div className="select">
                <select ref={roleFld}>
                  <option>Choisir une option</option>
                  <option value="builder">Créateur de parcours</option>
                  <option value="player">Joueur</option>
                </select>
              </div>
            </div>
            <div className="field">
              <button className="button is-link">Continuer</button>
            </div>
          </form>
  );
}

export default LoginForm;