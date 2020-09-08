import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from './routes/Login.js'
import Registration from './routes/Registration.js'
import Trails from './routes/Trails.js'
import Stats from './routes/Stats.js'
import NewTrail from './routes/NewTrail.js'

function App() {
  return (
    <Router>
      <div className="App">

      <div className='temp-nav'><div className="container"><Link to="/">Identification</Link>
        <Link to="/registration">Inscription</Link>
        <Link to="/trails">Parcours</Link>
        <Link to="/stats">Stats</Link>
        <Link to="/new-trail">NewTrail</Link></div></div>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/registration" component={Registration} />
          <Route exact path="/trails" component={Trails} />
          <Route exact path="/stats" component={Stats} />
          <Route exact path="/new-trail" component={NewTrail} />
        </Switch>
    </div>
    </Router>
  );
}

export default App;
