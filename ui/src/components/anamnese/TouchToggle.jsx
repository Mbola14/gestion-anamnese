import React from 'react';
import { Label } from "@/components/ui/label";

export default function TouchToggle({ 
  label, 
  options, 
  value, 
  onChange,
  className = ""
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-600">{label}</Label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-3 rounded-xl font-medium text-sm transition-all touch-manipulation ${
              value === option.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}