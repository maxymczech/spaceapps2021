import './SignIn.css';
import React, { useContext, useState } from 'react';
import { SessionContext } from '../contexts/Session';

export default function() {
  const [errorText, setErrorText] = useState('');
  const [userEmail, setUserEmail] = useState('fd@test.com');
  const [userPassword, setUserPassword] = useState('password');
  const { signIn } = useContext(SessionContext);

  const handleSubmit = e => {
    e.preventDefault();
    if (userEmail && userPassword) {
      signIn(userEmail, userPassword, setErrorText);
    }
  };

  return <>
    <div className="screen-sign-in">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="user-email">Email:</label>
          <input
            autoComplete="on"
            id="user-email"
            onChange={e => setUserEmail(e.target.value)}
            type="email"
            value={userEmail}
          />
        </div>
        <div className="form-row">
          <label htmlFor="user-password">Password:</label>
          <input
            autoComplete="on"
            id="user-password"
            onChange={e => setUserPassword(e.target.value)}
            type="password"
            value={userPassword}
          />
        </div>
        <div className="form-submit">
          <button type="submit">Log in</button>
        </div>
        {errorText && (
          <div className="error-text">
            {errorText}
          </div>
        )}
      </form>
    </div>
  </>;
}
