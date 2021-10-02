import './UserSettings.css';
import React, { useContext, useState } from 'react';
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { SessionContext } from '../contexts/Session';
import config from '../config/app';

export default function({ onClose }) {
  const { user, userDetails } = useContext(SessionContext);
  const [errorText, setErrorText] = useState('');
  const [userConsoleSeat, setUserConsoleSeat] = useState(userDetails?.consoleSeat ?? '');
  const [userName, setUserName] = useState(userDetails?.name ?? '');
  const [userPosition, setUserPosition] = useState(userDetails?.position ?? '');

  const handleSubmit = e => {
    e.preventDefault();
    
    if (user?.uid) {
      const db = getFirestore();
      updateDoc(doc(db, "users", user.uid), {
        consoleSeat: userConsoleSeat,
        name: userName,
        position: userPosition
      }).then(() => {
        onClose?.();
      }, error => {
        setErrorText?.(error.code);
      });
    }
  }

  return (
    <>
      <div className="modal">
        <h2>User Settings</h2>
        <button
          className="btn-close"
          onClick={() => onClose?.()}
          type="button"
        >
          Close
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email:</label>
            <div>
              {user.email}
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="user-console-seat">Console Seat:</label>
            <input
              autoComplete="on"
              id="user-console-seat"
              onChange={e => setUserConsoleSeat(e.target.value)}
              type="text"
              value={userConsoleSeat}
            />
          </div>
          <div className="form-row">
            <label htmlFor="user-name">Name:</label>
            <input
              autoComplete="on"
              id="user-name"
              onChange={e => setUserName(e.target.value)}
              type="text"
              value={userName}
            />
          </div>
          <div className="form-row">
            <label htmlFor="user-position">Flight Control Position:</label>
            <select
              onChange={e => setUserPosition(e.target.value)}
              value={userPosition}
            >
              {Object.keys(config.app.flightControlPositions).map(id => (
                <option
                  key={id}
                  value={id}
                >
                  {`${id} - ${config.app.flightControlPositions[id]}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-submit">
            <button type="submit">Save</button>
          </div>
          {errorText && (
            <div className="error-text">
              {errorText}
            </div>
          )}
        </form>
      </div>
      <div
        className="modal-backdrop"
        onClick={() => onClose?.()}
      />
    </>
  );
}
