import './ConsoleForm.css';
import React, { useCallback, useContext, useState } from 'react';
import { addDoc, getFirestore } from "firebase/firestore"; 
import Filters from './Filters';
import { SessionContext } from '../contexts/Session';

export default function({ item = null }) {
  const { user, userDetails, userRef } = useContext(SessionContext);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [description, setDescription] = useState(item?.description ?? '');
  const [entryTopic, setEntryTopic] = useState(item?.entryTopic ?? '');
  const [hardwareUsed, setHardwareUsed] = useState(item?.hardwareUsed ?? '');
  const [tags, setTags] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (description) {
      setLoading(true);
      const db = getFirestore();
      addDoc(collection(db, "logs"), {
        attachments: [],
        author: userRef,
        consoleSeat: userDetails.consoleSeat,
        // dateCreated: 
      }).then(docRef => {
      }, error => {
        setErrorText(error.code);
      }).finally(() => {
        setLoading(false);
      });
    }
  }

  const onTagsChange = useCallback(tags => {
    setTags(tags);
  }, []);

  const formClassName = `console-form-rest ${expanded && 'expanded'}`;

  return (
    <div className="console-form">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <textarea
            id="log-description"
            onChange={e => setDescription(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="Start typing your log"
            rows="4"
            type="text"
            value={description}
          />
          {/* onBlur={e => !e.target.value && setExpanded(false)} */}
        </div>
        <div className={formClassName}>
          <div className="form-row">
            <label htmlFor="log-entry-topic">Entry Topic:</label>
            <input
              autoComplete="on"
              id="log-entry-topic"
              onChange={e => setEntryTopic(e.target.value)}
              type="text"
              value={entryTopic}
            />
          </div>
          <div className="form-row">
            <label htmlFor="log-hardware-used">Hardware Used:</label>
            <input
              autoComplete="on"
              id="log-hardware-used"
              onChange={e => setHardwareUsed(e.target.value)}
              type="text"
              value={hardwareUsed}
            />
          </div>
          <div className="form-row">
            <Filters
              onTagsChange={onTagsChange}
            />
          </div>
          <div className="form-row">
            <div className="console-form-item">
              <div className="form-submit">
                <button type="submit">Save</button>
                <a
                  href="#"
                  onClick={e => {
                    e?.preventDefault?.();
                    setExpanded(false);
                  }}
                >
                  Hide Form
                </a>
              </div>
            </div>
          </div>
          {errorText && (
            <div className="error-text">
              {errorText}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
