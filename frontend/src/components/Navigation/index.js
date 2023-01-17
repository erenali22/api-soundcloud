import React from 'react';
import { NavLink } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded, signedIn, user }) {
  let sessionLinks;
  if (user) {
    sessionLinks = (
      <>
        <li>
          <NavLink exact to="/songs">Songs</NavLink>
        </li>
        <li>
          <NavLink exact to="/albums">Albums</NavLink>
        </li>
        <li>
          <ProfileButton user={user} />
        </li>
      </>
    );
  } else {
    sessionLinks = (
      <>
        <li>
          <OpenModalButton
            buttonText="Sign in"
            modalComponent={<LoginFormModal />}
          />
        </li>
        <li>
          <OpenModalButton
            buttonText="Sign up"
            modalComponent={<SignupFormModal />}
          />
        </li>
      </>
    );
  }

  return (
    <ul className='header'>
      <li>
        <NavLink exact to="/">Home</NavLink>
      </li>
      {isLoaded && signedIn !== null && sessionLinks}
    </ul>
  );
}

export default Navigation;
