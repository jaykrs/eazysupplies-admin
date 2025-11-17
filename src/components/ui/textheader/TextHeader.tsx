'use client';
import React, { useEffect, useState } from 'react';
import HoverPopover from '../popupbutton/HoverPopover';

interface TextHeadingProps {
  title: string;
  icon?: React.ReactNode;
  icon2?: React.ReactNode;
  buttonprops?: {
    buttonText: string;
    title: string;
    content: string;
    onClick?: () => void;
  };
  secondbuttonprops?: {
    buttonText: string;
    title: string;
    content: string;
    onClick?: () => void;
  };
}

const TextHeading: React.FC<TextHeadingProps> = ({ title, icon, icon2, buttonprops, secondbuttonprops }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div className={`flex justify-between items-center p-6 transition-all duration-700 ease-out ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>

      <div className="flex items-center space-x-2">
        {icon && <span className="text-xl">{icon}</span>}
        {icon2 && <span className="text-xl">{icon2}</span>}
        <h3 className="text-2xl md:text-2xl font-extrabold uppercase text-gray-600 dark:text-grey">
          {title}
        </h3>
      </div>
      <div className='flex items-center'>
        <div>
          {buttonprops && (
            <div>
              <HoverPopover
                buttonText={buttonprops.buttonText}
                title={buttonprops.title}
                content={buttonprops.content}
                onClick={buttonprops.onClick}
              />
            </div>
          )}
        </div>
        <div>
          {secondbuttonprops && (
            <div>
              <HoverPopover
                buttonText={secondbuttonprops.buttonText}
                title={secondbuttonprops.title}
                content={secondbuttonprops.content}
                onClick={secondbuttonprops.onClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextHeading;
