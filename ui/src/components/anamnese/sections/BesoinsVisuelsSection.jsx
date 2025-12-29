import React from 'react';
import { Glasses, Eye } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import TouchToggle from '../TouchToggle';
import TouchTextarea from '../TouchTextarea';

export default function BesoinsVisuelsSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Besoins Visuels" icon={Glasses} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Glasses className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">Port de lunettes</span>
          </div>
          <TouchToggle
            options={[
              { value: 'occasionnel', label: 'Occasionnel' },
              { value: 'regulier', label: 'Régulier' }
            ]}
            value={data.port_lunettes}
            onChange={(v) => handleChange('port_lunettes', v)}
          />
        </div>

        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">Port de lentilles</span>
          </div>
          <TouchToggle
            options={[
              { value: 'non', label: 'Non' },
              { value: 'occasionnel', label: 'Occasionnel' },
              { value: 'regulier', label: 'Régulier' }
            ]}
            value={data.port_lentilles}
            onChange={(v) => handleChange('port_lentilles', v)}
          />
        </div>
      </div>

      <TouchTextarea
        label="Sentez-vous vos yeux ?"
        value={data.sentez_yeux}
        onChange={(v) => handleChange('sentez_yeux', v)}
        placeholder="Fatigue visuelle, sécheresse, picotements..."
        rows={3}
      />
    </div>
  );
}