import './ConsoleLog.css';
import React from 'react';
import ConsoleLogItem from './ConsoleLogItem';

export default function({ logs = [] }) {
  return (
    <div className="console-log">
      {logs.map(item => (
        <ConsoleLogItem
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}
