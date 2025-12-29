import React from 'react';
import { Check } from 'lucide-react';

export default function TouchCheckbox({ 
  label, 
  checked, 
  onChange,
  className = ""
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all touch-manipulation ${
        checked 
          ? "border-blue-500 bg-blue-50" 
          : "border-gray-200 bg-white hover:border-gray-300"
      } ${className}`}
    >
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
        checked 
          ? "bg-blue-600 text-white" 
          : "bg-gray-100"
      }`}>
        {checked && <Check className="w-4 h-4" />}
      </div>
      <span className={`font-medium ${checked ? "text-blue-700" : "text-gray-700"}`}>
        {label}
      </span>
    </button>
  );
}