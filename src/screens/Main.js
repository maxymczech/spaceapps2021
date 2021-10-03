import './Main.css';
import React, { useCallback, useEffect, useState } from 'react';
import { collection, getFirestore, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import ConsoleForm from '../components/ConsoleForm';
import ConsoleLog from '../components/ConsoleLog';
import Filters from '../components/Filters';
import NavBar from '../components/NavBar';
import scrollLogToBottom from '../utils/scroll-log-to-bottom';

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
      scrollLogToBottom();
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
        <div className="screen-main-columns">
          <div className="screen-main-content">
            <Filters
              textExplanation="Available filters: author, console, topic, hardware, sample, tag. For example, filter by &quot;hardware:hammer&quot;"
              onTagsChange={onTagsChange}
            />
            <ConsoleLog logs={logs} />
          </div>
          <div className="screen-main-sidebar">
            <ConsoleForm />
          </div>
        </div>
      </div>
    </>
  );
}
