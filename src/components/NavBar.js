import './NavBar.css';
import React, { useContext, useState } from 'react';
import { SessionContext } from '../contexts/Session';
import UserSettings from './UserSettings';
import config from '../config/app';

export default function({ signInFunc }) {
  const { signOut, user, userDetails } = useContext(SessionContext);
  const [showSettings, setShowSettings] = useState(false);

  const iconImage = userDetails?.position && `./images/${userDetails.position.toLowerCase()}.png`;

  return (
    <>
      <div className="nav-bar">
        {userDetails?.name && <div className="nav-bar-item user-name">
          {iconImage && <img
            alt={userDetails?.position}
            className="nav-bar-icon"
            src={iconImage}
          />}
          <span className="user-info-label">Name:</span>
          {' '}
          {userDetails.name}
        </div>}
        {userDetails?.position && <div className="nav-bar-item user-position">
          <span className="user-info-label">Flight Control Position:</span>
          {' '}
          <span title={config.app.flightControlPositions[userDetails?.position]}>{userDetails.position}</span>
        </div>}
        {userDetails?.consoleSeat && <div className="nav-bar-item user-position">
          <span className="user-info-label">Console Seat:</span>
          {' '}
          {userDetails.consoleSeat}
        </div>}
        <div className="flex-grow"></div>
        {userDetails && <button
          className="btn-user-settings"
          onClick={() => setShowSettings(true)}
          type="button"
        >
          Settings
        </button>}
        {user && <button
          className="btn-sign-out"
          onClick={signOut}
          type="button"
        >
          Sign&nbsp;Out
        </button>}
        {!user && <button
          className="btn-sign-out"
          onClick={() => signInFunc?.()}
          type="button"
        >
          Sign&nbsp;In
        </button>}
      </div>
      <div className="nav-bar-instead"></div>
      {showSettings && (
        <UserSettings
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}
