import './App.css';
import React, { useEffect, useState } from 'react';
import { SessionContext, SessionProvider } from './contexts/Session';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoadingScreen from './screens/Loading';
import MainScreen from './screens/Main';
import SignInScreen from './screens/SignIn';
import config from './config/app';
import { initializeApp } from "firebase/app";

export default function() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    // Initialize Firebase application
    /* const app = */ initializeApp(config.firebase);

    // Subscribe to auth state changes
    const auth = getAuth();
    const authUnsubscribe = onAuthStateChanged(auth, user => {
      setSignedIn(Boolean(user));
      setLoading(false);
    });

    return () => {
      authUnsubscribe?.();
    }
  }, []);

  return loading ? <LoadingScreen /> : (
    <SessionProvider>
      {signedIn ? <MainScreen /> : <SignInScreen />}
    </SessionProvider>
  );
}
