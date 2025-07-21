
import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string; // Allow passing external classes to the wrapper
  style?: React.CSSProperties; // Allow passing external styles to the wrapper
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top', className, style }) => {
  const [visible, setVisible] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className={`relative ${className || 'inline-block'}`} // Default to inline-block if no specific display class passed
      style={style}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div 
          role="tooltip"
          className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap dark:bg-gray-700 ${positionClasses[position]}`}
        >
          {text}
          <div className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 ${
            position === 'top' ? 'left-1/2 -translate-x-1/2 top-full -mt-1' :
            position === 'bottom' ? 'left-1/2 -translate-x-1/2 bottom-full -mb-1' :
            position === 'left' ? 'top-1/2 -translate-y-1/2 left-full -ml-1' :
            'top-1/2 -translate-y-1/2 right-full -mr-1'
          }`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
