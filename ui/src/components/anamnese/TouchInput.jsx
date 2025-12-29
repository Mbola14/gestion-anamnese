import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TouchInput({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder,
  className = "",
  size = "default"
}) {
  const sizeClasses = {
    small: "h-10 text-sm",
    default: "h-12 text-base",
    large: "h-14 text-lg"
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-600">{label}</Label>
      )}
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${sizeClasses[size]} px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all`}
      />
    </div>
  );
}