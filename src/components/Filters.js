import './Filters.css';
import React, { useEffect, useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';

export default function({ onTagsChange, textExplanation = '' }) {
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleAddition = tag => {
    setTags(tags => [...tags, tag]);
  }

  const handleDelete = i => {
    setTags(tags => tags.filter((tag, index) => index !== i));
  }

  useEffect(() => {
    onTagsChange?.(tags);
  }, [tags]);

  return (
    <div className="console-filter">
      <ReactTags
        allowDragDrop={false}
        delimiters={[9, 10, 13, 188]}
        handleAddition={handleAddition}
        handleDelete={handleDelete}
        suggestions={suggestions}
        tags={tags}
      />
      {textExplanation && <div className="text-explanation">
        {textExplanation}
      </div>}
    </div>
  );
}
