import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import uid from 'uid';
import Login from './routes/Login.js'
import Registration from './routes/Registration.js'
import Trails from './routes/Trails.js'
import Stats from './routes/Stats.js'
import Trail from './routes/Trail.js'
import Contexts from './contexts/Contexts.js'

function App() {

  const context = useContext(Contexts);
  const [myContext, setMyContext] = useState(context);

  return (
    <Contexts.Provider value={{ myContext, setMyContext }}>
    <Router>
      <div className="App">

      {/* <div className='temp-nav'><div className="container">
        <Link to="/">Identification</Link>
        <Link to="/registration">Inscription</Link>
        <Link to="/trails">Parcours</Link>
        <Link to="/trail">Trail</Link></div></div> */}
        <Switch>
          <Route exact path="/" component={Login}>
            <Login key={uid()} />
          </Route>
          <Route exact path="/registration" component={Registration}>
            <Registration key={uid()} />
          </Route>
          <Route exact path="/trails">
            <Trails key={uid()} />
          </Route>
          <Route exact path="/stats" component={Stats}>
            <Stats key={uid()} />
          </Route>
          <Route exact path="/trail" component={Trail}>
            <Trail key={uid()} />
          </Route>
        </Switch>
    </div>
    </Router>
    </Contexts.Provider>
  );
}

export default App;
