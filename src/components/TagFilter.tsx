import { useState } from 'react';

interface TagFilterProps {
  topics: string[];
  activeTopic: string;
  onSelect: (topic: string) => void;
}

export default function TagFilter({ topics, activeTopic, onSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelect('All')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          activeTopic === 'All'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        All
      </button>
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelect(topic)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTopic === topic
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}
