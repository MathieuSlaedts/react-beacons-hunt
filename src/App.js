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
        <Switch>
          <Route exact path="/">
            <Login key={uid()} />
          </Route>
          <Route exact path="/registration">
            <Registration key={uid()} />
          </Route>
          {/* <Route exact path="/trails"><Trails key={uid()} /></Route> */}
          {/* <Route exact path="/stats" component={Stats} key={uid()} /> */}
          <Route exact path="/trails" render={(props) => <Trails {...props} key={uid()} />} />
          <Route exact path="/stats" render={(props) => <Stats {...props} key={uid()} />} />
          <Route exact path="/trail" component={Trail} key={uid()} />
        </Switch>
    </div>
    </Router>
    </Contexts.Provider>
  );
}

export default App;
