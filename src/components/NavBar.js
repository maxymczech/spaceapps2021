import './NavBar.css';
import React, { useContext } from 'react';
import { SessionContext } from '../contexts/Session';

export default function() {
  const { signOut } = useContext(SessionContext);

  return (
    <div className="nav-bar">
      <button
        className="btn-sign-out"
        onClick={signOut}
      >
        Sign Out
      </button>
    </div>
  );
}
