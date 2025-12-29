import React from 'react';
import { ClipboardList, Eye } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import TouchInput from '../TouchInput';
import TouchTextarea from '../TouchTextarea';
import TouchCheckbox from '../TouchCheckbox';

export default function AnamneseSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Anamnèse" icon={ClipboardList} />
      
      <TouchInput
        label="Écarts pupillaires"
        value={data.ecarts_pup}
        onChange={(v) => handleChange('ecarts_pup', v)}
        placeholder="Écarts pup"
      />

      <TouchTextarea
        label="But de la visite boutique"
        value={data.but_visite}
        onChange={(v) => handleChange('but_visite', v)}
        placeholder="Raison de la visite..."
        rows={2}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchTextarea
          label="Satisfait de votre équipement ?"
          value={data.satisfaction_equipement}
          onChange={(v) => handleChange('satisfaction_equipement', v)}
          placeholder="Satisfaction équipement actuel..."
          rows={2}
        />
        <TouchTextarea
          label="De la vision ?"
          value={data.satisfaction_vision}
          onChange={(v) => handleChange('satisfaction_vision', v)}
          placeholder="Satisfaction vision..."
          rows={2}
        />
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-800">Net et confortable</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <TouchCheckbox
            label="VL (Vision de Loin)"
            checked={data.net_confortable_vl}
            onChange={(v) => handleChange('net_confortable_vl', v)}
          />
          <TouchCheckbox
            label="VI (Vision Intermédiaire)"
            checked={data.net_confortable_vi}
            onChange={(v) => handleChange('net_confortable_vi', v)}
          />
          <TouchCheckbox
            label="VP (Vision de Près)"
            checked={data.net_confortable_vp}
            onChange={(v) => handleChange('net_confortable_vp', v)}
          />
        </div>
      </div>

      <TouchTextarea
        label="But de la visite ophta PIO FO"
        value={data.but_visite_ophta}
        onChange={(v) => handleChange('but_visite_ophta', v)}
        placeholder="Informations ophta..."
        rows={2}
      />

      <TouchInput
        label="Orthoptie"
        value={data.orthoptie}
        onChange={(v) => handleChange('orthoptie', v)}
        placeholder="Orthoptie..."
      />
    </div>
  );
}