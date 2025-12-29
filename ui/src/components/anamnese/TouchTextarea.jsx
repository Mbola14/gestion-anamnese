import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function TouchTextarea({ 
  label, 
  value, 
  onChange, 
  placeholder,
  rows = 3,
  className = ""
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-600">{label}</Label>
      )}
      <Textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="px-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl resize-none text-base"
      />
    </div>
  );
}