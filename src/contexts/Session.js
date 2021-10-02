import React, { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as FirebaseSignOut
} from "firebase/auth";

const SessionContext = React.createContext();

const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const authUnsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
    });

    return () => {
      authUnsubscribe?.();
    }
  }, []);


  const signIn = (email, password, setErrorText) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password).then(user => {
      setUser(user);
    }, error => {
      setErrorText?.(error.code);
    });
  };

  const signOut = () => {
    const auth = getAuth();
    FirebaseSignOut(auth).then(() => {
      setUser(null);
    }, () => {
      // TODO: handle sign-out failure
    });
  }

  const sessionState = {
    signIn,
    signOut,
    user
  };

  return (
    <SessionContext.Provider value={sessionState}>
      {children}
    </SessionContext.Provider>
  );
}

export { SessionContext, SessionProvider };
