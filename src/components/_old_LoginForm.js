import React from 'react';

const handelSubmit = (ev, loginType) => {
    ev.preventDefault();
    console.log('login', loginType);
};

function LoginForm(props) {
  return (
          <form onSubmit={ev => handelSubmit(ev, props.loginType)}>
            <div className="field">
              <label className="label">Nom d'utilisateur</label>
              <input className="input" type="text" placeholder="Nom d'utilisateur" />
            </div>
            <div className="field">
              <label className="label">Mot de passe</label>
              <input className="input" type="password" placeholder="Mot de passe" />
            </div>
            { props.loginType === "registration" &&
            <div className="field">
              <label className="label">Type de compte</label>
              <div className="select">
                <select>
                  <option>Choisir une option</option>
                  <option value="organisateur">Organisateur</option>
                  <option value="participant">Participant</option>
                </select>
              </div>
            </div>
            }
            <div className="field">
              <button className="button is-link">S'inscrire</button>
            </div>
          </form>
  );
}

export default LoginForm;