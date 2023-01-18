import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = (e) => {
    e.preventDefault()
    if (showMenu) return;
    setShowMenu(true);
    const box = e.target.getBoundingClientRect()
    ulRef.current.style.left = box.left + 'px'
    ulRef.current.style.top = (box.top + box.height) + 'px'
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', closeMenu)

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(() => {
      window.location = '/'
    })
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <a href='/'
        style={{ padding: '10px', cursor: 'pointer', width: 'auto' }} onClick={openMenu} className={`${showMenu ? 'active' : ''}`}>
        {user.firstName}{' '}{user.lastName}<i style={{ marginLeft: '10px', zoom: '0.7' }} className="fa-solid fa-chevron-down"></i>
      </a>
      <ul className={ulClassName} ref={ulRef}>
        <li><i className="fa-regular fa-user"></i>{user.username}</li>
        <li><i className="fa-regular fa-id-badge"></i>{user.firstName} {user.lastName}</li>
        <li><i className="fa-solid fa-inbox"></i>{user.email}</li>
        <li onClick={logout} className='logout'>
          <i className="fa-solid fa-right-from-bracket"></i>Log out
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
