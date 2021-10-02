import './ConsoleLogItem.css';
import React from 'react';

export default function({ item }) {
  return (
    <div className="console-log-item">
      <p>{item.data.dateCreated.toDate().toString()}</p>
      <p>{item.data.description}</p>
      <hr />
    </div>
  );
}
