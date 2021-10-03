import './ConsoleLogItem.css';
import React, { useContext, useEffect, useState } from 'react';
import { deleteDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { SessionContext } from '../contexts/Session';
import formatDate from '../utils/format-date';

export default function({ item }) {
  const { user, userDetails } = useContext(SessionContext);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    getDoc(item?.data?.author).then(doc => {
      if (doc) {
        setUserName(doc.data().name);
      }
    });
  }, [item]);

  const itemData = item?.data;
  const isOwn = user?.uid && itemData?.author?.id === user.uid;
  const itemDate = itemData?.dateCreated?.toDate?.();
  const dateString = itemDate ? formatDate(itemDate) : '';
  const iconImage = itemData?.position && `./images/${itemData.position.toLowerCase()}.png`;
  const authorClassName = `console-log-item-author ${itemData?.position}`;
  const approvedDate = itemData?.officiallyApproved && itemData?.dateApproved && formatDate(
    itemData?.dateApproved?.toDate?.()
  );

  const editItem = () => {
    alert('TODO');
  }

  const deleteItem = () => {
    if (confirm('Do you really want to delete this item?')) {
      deleteDoc(item.ref);
    }
  }

  const approveItem = () => {
    if (confirm('Do you really want to approve this log? After this you will not be able to edit or delete this log.')) {
      updateDoc(item.ref, {
        dateApproved: serverTimestamp(),
        officiallyApproved: true
      })
    }
  }

  return (
    <div className="console-log-item">
      <div className={authorClassName}>
        {userName && <div className="console-log-item-name">
          {iconImage && <img
            alt={itemData?.position}
            className="console-log-item-icon"
            src={iconImage}
          />}
          <span>Name:</span>
          {' '}
          {userName}
        </div>}
        {itemData?.consoleSeat && <div className="console-log-item-console-seat">
          <span>Console Seat:</span>
          {' '}
          {itemData?.consoleSeat}
        </div>}
        {itemData?.position && <div className="console-log-item-position">
          <span>Flight Control Position:</span>
          {' '}
          {itemData?.position}
        </div>}
      </div>
      <div className="console-log-item-date">{dateString}</div>
      <div className="console-log-item-description">{itemData?.description}</div>
      <div className="console-log-item-details">
        {itemData?.entryTopic && <div className="console-log-item-detail">
          <span>Entry Topic:</span>
          {' '}
          {itemData?.entryTopic}
        </div>}
        {itemData?.hardwareUsed && <div className="console-log-item-detail">
          <span>Hardware Used:</span>
          {' '}
          {itemData?.hardwareUsed}
        </div>}
        {itemData?.sampleType && <div className="console-log-item-detail">
          <span>Sample Type:</span>
          {' '}
          {itemData?.sampleType}
        </div>}
      </div>
      <div className="console-log-item-tags">
        {itemData?.tags?.map(tag => (
          <div
            className="tag"
            key={tag}
          >
            {tag}
          </div>
        ))}
      </div>

      {itemData?.officiallyApproved && <div className="console-log-item-approved">
        Officially Approved on {approvedDate}
      </div>}

      {isOwn && !itemData?.officiallyApproved && <div className="console-log-item-buttons">
        <button
          onClick={() => editItem()}
          type="button"
        >
          Edit
        </button>
        <button
          onClick={() => deleteItem()}
          type="button"
        >
          Delete
        </button>
        <button
          onClick={() => approveItem()}
          type="button"
        >
          Oficially Approve
        </button>
      </div>}
    </div>
  );
}
