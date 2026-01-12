import React from 'react';
import { PackageCheck } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import TouchInput from '../TouchInput';
import TouchTextarea from '../TouchTextarea';
import TouchCheckbox from '../TouchCheckbox';

export default function LivraisonSection({ data, onChange, opticians = [] }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Livraison" icon={PackageCheck} />

      {/* Opticien */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Opticien</label>
        <select
          className="w-full rounded-xl border px-3 py-3 bg-background"
          value={data.livraison_opticien || ''}
          onChange={(e) => handleChange('livraison_opticien', e.target.value)}
        >
          <option value="" disabled>
            Choisir un opticien…
          </option>
          {opticians.map((optician) => (
            <option key={optician.id} value={optician.id}>
              {optician.prenom}
            </option>
          ))}
        </select>
      </div>

      {/* Acuité visuelle */}
      <TouchInput
        label="Acuité visuelle ODG (/10)"
        value={data.acuite_odg}
        onChange={(v) => handleChange('acuite_odg', v)}
        placeholder="Ex : 10, 12, 15..."
      />

      {/* Champs qualitatifs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchTextarea
          label="Ressenti client"
          value={data.ressenti_client}
          onChange={(v) => handleChange('ressenti_client', v)}
          placeholder="Ressenti du client lors de la livraison..."
          rows={3}
        />
        <TouchTextarea
          label="Point(s) de vigilance"
          value={data.points_vigilance}
          onChange={(v) => handleChange('points_vigilance', v)}
          placeholder="Points de vigilance éventuels..."
          rows={3}
        />
      </div>

      {/* Satisfaction client */}
      <div className="p-4 rounded-xl border space-y-3">
        <span className="font-medium">Satisfaction client</span>
        <div className="flex flex-wrap gap-4">
          <TouchCheckbox
            label="Client satisfait"
            checked={data.client_satisfait}
            onChange={(v) => handleChange('client_satisfait', v)}
          />
          <TouchCheckbox
            label="Client insatisfait"
            checked={data.client_insatisfait}
            onChange={(v) => handleChange('client_insatisfait', v)}
          />
        </div>
      </div>
    </div>
  );
}
