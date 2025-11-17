'use client';
import React from 'react';
import Pencil from "@/icons/pencil.svg";

interface OptionItemProps {
  icon: string;
  name: string;
  pagepath?: string;
  author?: string;
  type?: string;
  published?: boolean;
  headerfooterId?: number;
  isSelected?: boolean;
  onClick: () => void;
  clientsidelibs?: string;
}

const OptionItem: React.FC<OptionItemProps> = ({
  icon,
  name,
  pagepath,
  author,
  type,
  published,
  headerfooterId,
  clientsidelibs,
  isSelected,
  onClick,
}) => {
  return (
    <div

      className={`flex items-center justify-between p-4 py-6 hover:rounded-lg border-b-2 last:border-b-0 bg-white dark:bg-gray-800 dark:text-gray-100 cursor-pointer transition-all duration-300
        ${isSelected ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-300 dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
    >
      <div className="w-1/5 text-sm font-medium text-gray-800 dark:text-gray-200">{name}</div>
      <div className="w-1/5 text-sm text-gray-600 dark:text-gray-300">{pagepath}</div>
      <div className="w-1/5 text-sm text-gray-500 dark:text-gray-400">{author}</div>
      <div className="w-1/5 text-sm text-gray-500 dark:text-gray-400">{type}</div>
      <div className="w-1/5 text-sm ps-4 justify-center text-gray-500 dark:text-gray-400">
        <span
          className={`inline-block w-3 h-3 rounded-full ${published ? 'bg-green-500' : 'bg-red-500'
            }`}
        ></span>
      </div>
      <div className="w-1/5 text-sm text-gray-500 dark:text-gray-400 ps-6">{headerfooterId}</div>
      <div className="w-1/5 text-sm text-gray-500 dark:text-gray-400 ps-6 truncate">
        {clientsidelibs}
      </div>

      <button
        onClick={onClick}
        aria-label="Edit"
        title="Edit"
        className={`w-1/5 text-sm text-gray-500 dark:text-gray-400 flex justify-end ${isSelected ? 'text-blue-600' : 'hover:text-gray-800 dark:hover:text-gray-200'}`}
      >
        <Pencil className="w-6 h-6 hover:text-gray-800 dark:hover:text-gray-200" />
      </button>
    </div>
  );
};

export default OptionItem;
