import './Main.css';
import React, { useCallback, useEffect, useState } from 'react';
import { collection, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
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

    const queryParts = [collection(db, 'logs')];
    let tagsAdded = false;
    tags?.forEach?.(tag => {
      // TODO: author

      if (tag?.text.indexOf('console:') === 0) {
        const consoleSeat = tag.text.substr(8);
        queryParts.push(where('consoleSeat', '==', consoleSeat));
        tagsAdded = true;
      }

      if (tag?.text.indexOf('topic:') === 0) {
        const entryTopic = tag.text.substr(6);
        queryParts.push(where('entryTopic', '==', entryTopic));
        tagsAdded = true;
      }

      if (tag?.text.indexOf('hardware:') === 0) {
        const hardwareUsed = tag.text.substr(9);
        queryParts.push(where('hardwareUsed', '==', hardwareUsed));
        tagsAdded = true;
      }

      if (tag?.text.indexOf('sample:') === 0) {
        const sampleType = tag.text.substr(7);
        queryParts.push(where('sampleType', '==', sampleType));
        tagsAdded = true;
      }

      if (tag?.text.indexOf('tag:') === 0) {
        const searchTag = tag.text.substr(4);
        queryParts.push(where('tags', 'array-contains-any', [searchTag]));
        tagsAdded = true;
        console.log(searchTag);
      }
    });

    // TODO: add indices
    if (!tagsAdded) {
      queryParts.push(orderBy('dateCreated', 'asc'));
    }

    queryParts.push(limit(100));
    const q = query(...queryParts);

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
  }, [tags]);

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
              onTagsChange={onTagsChange}
              textExplanation="Available filters: console, topic, hardware, sample, tag. For example, filter by &quot;hardware:hammer&quot;"
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
