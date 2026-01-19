import React from 'react';
import { Settings } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import TouchInput from '../TouchInput';
import TouchCheckbox from '../TouchCheckbox';

export default function ControleEquipementSection({ data, onChange, opticians = [] }) {
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
            <div className="space-y-2">
              <label className="block text-sm font-medium">Opticien</label>
              <select
                className="w-full rounded-xl border px-3 py-3 bg-background"
                value={data.controle_1er_opticien || ""}
                onChange={(e) => handleChange("controle_1er_opticien", e.target.value)}
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
              <p className="text-xs text-muted-foreground">
                Liste déroulante avec les prénoms des opticiens de la boutique.
              </p>
            </div>

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
            <div className="space-y-2">
              <label className="block text-sm font-medium">Opticien</label>
              <select
                className="w-full rounded-xl border px-3 py-3 bg-background"
                value={data.controle_2eme_opticien || ""}
                onChange={(e) => handleChange("controle_2eme_opticien", e.target.value)}
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
              <p className="text-xs text-muted-foreground">
                Liste déroulante avec les prénoms des opticiens de la boutique.
              </p>
            </div>
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


        {/* Opticien */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Opticien</label>
          <select
            className="w-full rounded-xl border px-3 py-3 bg-background"
            value={data.controle_opticien || ""}
            onChange={(e) => handleChange("controle_opticien", e.target.value)}
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
          <p className="text-xs text-muted-foreground">
            Liste déroulante avec les prénoms des opticiens de la boutique.
          </p>
        </div>

        {/* Sécurité monture métal */}
        <TouchCheckbox
          label="Si monture en métal : pointage ou Loctite effectué dans les charnières de face"
          checked={data.securite_monture_metal}
          onChange={(v) => handleChange('securite_monture_metal', v)}
        />

      </div>
    </div>
  );
}