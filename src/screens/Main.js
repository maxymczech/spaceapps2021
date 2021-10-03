import './Main.css';
import React, { useCallback, useEffect, useState } from 'react';
import { collection, getFirestore, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import ConsoleForm from '../components/ConsoleForm';
import ConsoleLog from '../components/ConsoleLog';
import Filters from '../components/Filters';
import NavBar from '../components/NavBar';

export default function() {
  const [logs, setLogs] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const db = getFirestore();

    // TODO: apply filters
    const q = query(
      collection(db, 'logs'),
      orderBy('dateCreated', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, querySnapshot => {
      const logs = [];
      querySnapshot.forEach((doc) => {
        logs.push({
          data: doc.data(),
          id: doc.id,
          ref: doc.ref
        });
      });
      setLogs(logs);
    });

    return () => {
      unsubscribe?.();
    }
  }, []);

  const onTagsChange = useCallback(tags => {
    setTags(tags);
  }, []);
  
  return (
    <>
      <div className="screen-main">
        <NavBar />
        <Filters onTagsChange={onTagsChange} />
        <ConsoleLog logs={logs} />
        <ConsoleForm />
      </div>
    </>
  );
}