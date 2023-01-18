import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Switch,
  Route,
} from "react-router-dom";
import Songs from "./components/Songs";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { restoreCSRF } from './store/csrf'
import { Home } from "./components/Home";
import Albums from "./components/Albums";
import { useSelector } from 'react-redux';
import AlbumDetails from "./components/Albums/AlbumDetails";

function App() {

  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const loaded = useSelector(state => state.session.loaded);
  const signedIn = useSelector(state => state.session.signedIn);

  useEffect(() => {
    restoreCSRF().then(() => {
      dispatch(sessionActions.restoreUser())
        .then(() => {
          dispatch(sessionActions.setLoaded(true))
          dispatch(sessionActions.setSignedIn(true))
        })
        .catch(() => {
          dispatch(sessionActions.setLoaded(true))
          dispatch(sessionActions.setSignedIn(false))
          if (window.location.pathname !== '/') {
            window.location = '/'
          }
        })
    })
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={loaded} signedIn={signedIn} user={sessionUser} />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/songs" exact>
          <Songs />
        </Route>
        <Route path="/albums" exact>
          <Albums />
        </Route>
        <Route path="/albums/:id">
          <AlbumDetails />
        </Route>
      </Switch>
    </>
  );
}

export default App;
