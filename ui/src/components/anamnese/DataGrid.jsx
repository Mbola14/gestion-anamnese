import React from 'react';
import { Input } from "@/components/ui/input";

export default function DataGrid({ 
  title,
  headers,
  rows,
  data,
  onChange,
  className = ""
}) {
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 ${className}`}>
      {title && (
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <span className="font-medium text-gray-700 text-sm">{title}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                
              </th>
              {headers.map((header, idx) => (
                <th 
                  key={idx}
                  className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50/50">
                <td className="px-3 py-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                  {row.label}
                </td>
                {row.fields.map((field, fieldIdx) => (
                  <td key={fieldIdx} className="px-2 py-2">
                    <Input
                      value={data[field] || ""}
                      onChange={(e) => onChange(field, e.target.value)}
                      className="h-10 text-center text-sm border-gray-200 rounded-lg focus:border-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}