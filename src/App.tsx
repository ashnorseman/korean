import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { Route, Redirect, Switch, HashRouter } from 'react-router-dom';

import './App.css';

import { LessonPage } from './pages/lesson';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />

      <HashRouter>
        <Switch>
          <Route path="/book/:book/lesson/:lesson" children={<LessonPage />} />

          <Route path="*">
            <Redirect to="/book/1/lesson/1" />
          </Route>
        </Switch>
      </HashRouter>
    </React.Fragment>
  );
}

export default App;
