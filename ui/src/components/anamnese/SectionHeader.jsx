import React from 'react';

export default function SectionHeader({ title, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-blue-200">
      {Icon && (
        <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
      )}
      <h2 className="text-xl font-semibold text-gray-800 tracking-tight">{title}</h2>
    </div>
  );
}