import React, { useState } from 'react';

const HoverPopover = ({
  title,
  content,
  buttonText,
  onClick,
}: {
  title: any;
  content: any;
  buttonText: any;
  onClick?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!buttonText) return null; 

  return (
    <div className="relative inline-block">
      <button
        onClick={onClick}
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="text-grey mb-3 me-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 text-center"
      >
        {buttonText}
      </button>

      {isHovered && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 mt-16 w-64 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 z-10">
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <div className="px-3 py-2">
            <p>{content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverPopover;
