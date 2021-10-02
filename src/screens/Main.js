import React, { useCallback, useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import ConsoleLog from '../components/ConsoleLog';
import Filters from '../components/Filters';
import NavBar from '../components/NavBar';
import { getFirestore } from 'firebase/firestore'

export default function() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    // TODO: apply filters
    const q = query(
      collection(db, 'logs'),
      orderBy('dateCreated', 'asc'),
      limit(100)
    );
    const unsub = onSnapshot(q, querySnapshot => {
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
  }, []);

  const onTagsChange = useCallback(tags => {
    console.log('onTagsChange', tags);
  }, []);
  
  return (
    <>
      <div className="screen-main">
        <NavBar />
        <Filters />
        <ConsoleLog logs={logs} />
        
      </div>
    </>
  );
}
