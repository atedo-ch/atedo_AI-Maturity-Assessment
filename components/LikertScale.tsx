import React from 'react';
import { LikertValue } from '../types';

interface LikertScaleProps {
  questionText: string;
  value: LikertValue;
  onChange: (val: LikertValue) => void;
}

const LikertScale: React.FC<LikertScaleProps> = ({ questionText, value, onChange }) => {
  const options = [1, 2, 3, 4, 5];

  return (
    <div className="py-6 first:pt-0 border-b border-gray-100 last:border-0 animate-fade-in-up">
      <p className="block text-atedo-dark font-medium mb-5 text-lg leading-relaxed">
        {questionText}
      </p>
      
      <div className="space-y-3">
        {/* Scale Visual */}
        <div className="flex items-center justify-between gap-2">
          {options.map((optionValue) => {
            const isSelected = value === optionValue;
            
            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => onChange(optionValue)}
                className={`
                  relative flex-1 h-14 transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atedo-orange
                  ${isSelected 
                    ? 'bg-atedo-dark text-white shadow-lg translate-y-[-2px]' 
                    : 'bg-atedo-gray-bg text-slate-400 hover:bg-white/50 hover:shadow-md hover:text-atedo-dark hover:border-gray-200 border border-transparent'
                  }
                `}
              >
                <span className={`text-lg font-bold ${isSelected ? 'scale-110' : 'scale-100'} block transition-transform`}>
                  {optionValue}
                </span>
                
                {/* Active Indicator Dot */}
                {isSelected && (
                   <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-atedo-orange"></span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Labels */}
        <div className="flex justify-between px-1 mt-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trifft überhaupt nicht zu</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Trifft voll und ganz zu</span>
        </div>
      </div>
    </div>
  );
};

export default LikertScale;