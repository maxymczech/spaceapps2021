import './ConsoleForm.css';
import React, { useCallback, useContext, useState } from 'react';
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore"; 
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
  const [sampleType, setSampleType] = useState(item?.hardwareUsed ?? '');
  const [tags, setTags] = useState([]);
  const [clearTags, setClearTags] = useState(null);

  const propagateClearTags = cbFunction => {
    setClearTags(cbFunction);
  }

  const onTagsChange = useCallback(tags => {
    setTags(tags);
  }, []);

  const clearForm = () => {
    setErrorText('');
    setDescription('');
    setEntryTopic('');
    setHardwareUsed('');
    setSampleType('');
    clearTags?.();
  }

  // const formClassName = `console-form-rest ${expanded && 'expanded'}`;
  const formClassName = `console-form-rest expanded`;

  const handleSubmit = e => {
    e.preventDefault();

    if (description) {
      setLoading(true);
      const db = getFirestore();
      addDoc(collection(db, "logs"), {
        attachments: [],
        author: userRef,
        consoleSeat: userDetails.consoleSeat,
        dateCreated: serverTimestamp(),
        dateEdited: null,
        description,
        entryTopic,
        hardwareUsed,
        officiallyApproved: false,
        position: userDetails.position,
        sampleType,
        tags: (tags || []).filter(Boolean).map(tag => tag.text || '')
      }).then(docRef => {
        clearForm();
      }, error => {
        setErrorText(error.code);
      }).finally(() => {
        setLoading(false);
      });
    }
  }

  return (
    <div className="console-form">
      <form onSubmit={handleSubmit}>
        <h2>Create New Log</h2>
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
            <label htmlFor="log-sample-type">Sample Type:</label>
            <input
              autoComplete="on"
              id="log-sample-type"
              onChange={e => setSampleType(e.target.value)}
              type="text"
              value={sampleType}
            />
          </div>
          <div className="form-row">
            <Filters
              propagateClearTags={propagateClearTags}
              onTagsChange={onTagsChange}
            />
          </div>
          <div className="form-row">
            <div className="console-form-item">
              <div className="form-submit">
                <button
                  disabled={loading}
                  type="submit"
                >
                  Save
                </button>

                {/* <a
                  href="#"
                  onClick={e => {
                    e?.preventDefault?.();
                    setExpanded(false);
                  }}
                >
                  Hide Form
                </a> */}
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
