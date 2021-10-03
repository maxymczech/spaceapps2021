import React, { useEffect, useState } from "react";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as FirebaseSignOut
} from "firebase/auth";

const SessionContext = React.createContext();

const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userRef, setUserRef] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const authUnsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
    });

    let detailUnsubscribe = null;
    if (user?.uid) {
      const db = getFirestore();
      detailUnsubscribe = onSnapshot(doc(db, "users", user.uid), doc => {
        setUserDetails(doc.data());
        setUserRef(doc.ref);
      });
    }

    return () => {
      authUnsubscribe?.();
      detailUnsubscribe?.();
    }
  }, [user]);


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
    user,
    userDetails,
    userRef
  };

  return (
    <SessionContext.Provider value={sessionState}>
      {children}
    </SessionContext.Provider>
  );
}

export { SessionContext, SessionProvider };
