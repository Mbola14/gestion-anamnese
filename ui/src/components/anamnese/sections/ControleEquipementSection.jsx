import React from 'react';
import { Settings } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import TouchInput from '../TouchInput';
import TouchCheckbox from '../TouchCheckbox';

export default function ControleEquipementSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Contrôle Équipements" icon={Settings} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1er Équipement */}
        <div className="p-5 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
          <h4 className="font-semibold text-blue-800 mb-4 text-lg">1er Équipement</h4>
          <div className="space-y-4">
            <TouchInput
              label="Opticien"
              value={data.controle_1er_opticien}
              onChange={(v) => handleChange('controle_1er_opticien', v)}
              placeholder="Nom opticien"
            />
            <div className="flex flex-wrap gap-3">
              <TouchCheckbox
                label="Vis"
                checked={data.controle_1er_vis}
                onChange={(v) => handleChange('controle_1er_vis', v)}
              />
              <TouchCheckbox
                label="Polissage"
                checked={data.controle_1er_polissage}
                onChange={(v) => handleChange('controle_1er_polissage', v)}
              />
              <TouchCheckbox
                label="Transition"
                checked={data.controle_1er_transition}
                onChange={(v) => handleChange('controle_1er_transition', v)}
              />
            </div>
          </div>
        </div>

        {/* 2ème Équipement */}
        <div className="p-5 bg-white rounded-xl border-2 border-teal-200 shadow-sm">
          <h4 className="font-semibold text-teal-800 mb-4 text-lg">2ème Équipement</h4>
          <div className="space-y-4">
            <TouchInput
              label="Opticien"
              value={data.controle_2eme_opticien}
              onChange={(v) => handleChange('controle_2eme_opticien', v)}
              placeholder="Nom opticien"
            />
            <div className="flex flex-wrap gap-3">
              <TouchCheckbox
                label="Vis"
                checked={data.controle_2eme_vis}
                onChange={(v) => handleChange('controle_2eme_vis', v)}
              />
              <TouchCheckbox
                label="Polissage"
                checked={data.controle_2eme_polissage}
                onChange={(v) => handleChange('controle_2eme_polissage', v)}
              />
              <TouchCheckbox
                label="Transition"
                checked={data.controle_2eme_transition}
                onChange={(v) => handleChange('controle_2eme_transition', v)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}