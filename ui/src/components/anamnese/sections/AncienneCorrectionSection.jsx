import React from 'react';
import { History } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import TouchInput from '../TouchInput';
import TouchTextarea from '../TouchTextarea';

export default function AncienneCorrectionSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Ancienne Correction" icon={History} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchInput
          label="Date facture"
          value={data.ancienne_date_facture}
          onChange={(v) => handleChange('ancienne_date_facture', v)}
          type="date"
        />
        <TouchInput
          label="Anciens verres"
          value={data.ancienne_verres}
          onChange={(v) => handleChange('ancienne_verres', v)}
          placeholder="Type de verres"
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-medium text-gray-700 mb-4">Correction précédente</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TouchTextarea
            label="OD (Œil Droit)"
            value={data.ancienne_od}
            onChange={(v) => handleChange('ancienne_od', v)}
            placeholder="Sphère, Cylindre, Axe..."
            rows={2}
          />
          <TouchTextarea
            label="OG (Œil Gauche)"
            value={data.ancienne_og}
            onChange={(v) => handleChange('ancienne_og', v)}
            placeholder="Sphère, Cylindre, Axe..."
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TouchInput
            label="AV"
            value={data.ancienne_av}
            onChange={(v) => handleChange('ancienne_av', v)}
            placeholder=""
          />
          <TouchInput
            label="Add"
            value={data.ancienne_add}
            onChange={(v) => handleChange('ancienne_add', v)}
            placeholder=""
          />
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-medium text-blue-700 mb-4">Ancien équipement</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TouchInput
            label="Epup"
            value={data.ancien_equipement_epup}
            onChange={(v) => handleChange('ancien_equipement_epup', v)}
            placeholder=""
          />
          <TouchInput
            label="Hauteur/Pupille"
            value={data.ancien_equipement_hauteur_pupille}
            onChange={(v) => handleChange('ancien_equipement_hauteur_pupille', v)}
            placeholder=""
          />
          <TouchInput
            label="Côtes"
            value={data.ancien_equipement_cotes}
            onChange={(v) => handleChange('ancien_equipement_cotes', v)}
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
}