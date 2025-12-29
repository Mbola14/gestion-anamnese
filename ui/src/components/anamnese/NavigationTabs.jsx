import React from 'react';
import { motion } from 'framer-motion';

export default function NavigationTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 p-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all touch-manipulation ${
                activeTab === tab.id
                  ? "text-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-100 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}