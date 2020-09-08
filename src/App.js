import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from './routes/Login.js'
import Registration from './routes/Registration.js'
import Trails from './routes/Trails.js'
import Stats from './routes/Stats.js'
import NewTrail from './routes/NewTrail.js'
import PlayTrail from './routes/PlayTrail.js'

function App() {
  return (
    <Router>
      <div className="App">

      <div className='temp-nav'><div className="container">
        {/* <Link to="/">Identification</Link>
        <Link to="/registration">Inscription</Link>
        <Link to="/stats">Stats</Link> */}
        <Link to="/trails">Parcours</Link>
        <Link to="/new-trail">NewTrail</Link>
        <Link to="/play-trail">PlayTrail</Link></div></div>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/registration" component={Registration} />
          <Route exact path="/trails" component={Trails} />
          <Route exact path="/stats" component={Stats} />
          <Route exact path="/new-trail" component={NewTrail} />
          <Route exact path="/play-trail" component={PlayTrail} />
        </Switch>
    </div>
    </Router>
  );
}

export default App;
