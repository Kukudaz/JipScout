import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipHelpProps {
  text: string;
}

export function TooltipHelp({ text }: TooltipHelpProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
      {show && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 sm:w-64 bg-gray-900 text-white text-xs p-3 rounded-xl shadow-xl whitespace-normal break-words text-center">
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          {text}
        </div>
      )}
    </div>
  );
}
