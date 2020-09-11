import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import uid from 'uid';
import Login from './routes/Login.js'
import Registration from './routes/Registration.js'
import Trails from './routes/Trails.js'
import Stats from './routes/Stats.js'
import CreateTrail from './routes/CreateTrail.js'
import PlayTrail from './routes/PlayTrail.js'
//import Trail from './routes/Trail.js'
import Context from './contexts/Context.js'

function App() {

  // -----------------------
  // CONTEXTS
  // -----------------------

  const theContext = useContext(Context);
  const [context, setContext] = useState(theContext);

  // -----------------------
  // RENDER
  // -----------------------

  return (
    <Context.Provider value={{ context, setContext }}>
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/registration" component={Registration} />
          <Route exact path="/trails" render={(props) => <Trails {...props} key={uid()} />} />
          <Route exact path="/stats" render={(props) => <Stats {...props} key={uid()} />} />
          <Route exact path="/create-trail" component={CreateTrail} />
          <Route exact path="/play-trail" component={PlayTrail} />
          {/* <Route exact path="/trail" component={Trail} /> */}
        </Switch>
    </div>
    </Router>
    </Context.Provider>
  );
}

export default App;
