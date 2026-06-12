import React from 'react';
import { PackageCheck } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import TouchInput from '../TouchInput';
import TouchTextarea from '../TouchTextarea';
import TouchToggle from "../TouchToggle";
import RecommendationContactSearch from './RecommendationContactSearch';

export default function LivraisonSection({ data, onChange, opticians = [] }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Livraison" icon={PackageCheck} />

      {/* Opticien */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Opticien validant la livraison</label>
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

      {/* Satisfaction client + Recommandé par */}
      <div
        className={[
          "p-4 rounded-xl border transition-colors space-y-4",
          data.satisfaction_client === "Satisfait"
            ? "border-green-500 bg-green-50"
            : data.satisfaction_client === "Insatisfait"
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-muted/30",
        ].join(" ")}
      >
        <div className="font-medium">Satisfaction client</div>

        <TouchToggle
          options={[
            { value: "Satisfait", label: "Satisfait" },
            { value: "Insatisfait", label: "Insatisfait" },
          ]}
          value={data.satisfaction_client || ""}
          onChange={(v) => handleChange("satisfaction_client", v)}
          className="gap-3"
          renderOption={(option, isActive) => (
            <div
              className={[
                "px-4 py-2 rounded-xl border cursor-pointer transition-colors text-sm font-medium",
                option.value === "Satisfait"
                  ? isActive
                    ? "bg-green-600 text-white border-green-600"
                    : "border-green-500 text-green-700"
                  : option.value === "Insatisfait"
                    ? isActive
                      ? "bg-red-600 text-white border-red-600"
                      : "border-red-500 text-red-700"
                    : "",
              ].join(" ")}
            >
              {option.label}
            </div>
          )}
        />

        {/* ✅ Séparateur */}
        <div className="border-t border-gray-200" />

        {/* ✅ Recommandé par — intégré dans le bloc satisfaction */}
        <RecommendationContactSearch
          data={data}
          onChange={(updater) => {
            const updated = typeof updater === "function" ? updater(data) : updater;
            onChange(updated);
          }}
        />
      </div>
    </div>
  );
}