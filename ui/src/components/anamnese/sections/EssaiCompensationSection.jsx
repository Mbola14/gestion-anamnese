import React from 'react';
import { TestTube2 } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import DataGrid from '../DataGrid';
import TouchInput from '../TouchInput';
import TouchTextarea from '../TouchTextarea';
import TouchCheckbox from '../TouchCheckbox';
import TouchToggle from "../TouchToggle";
import PenicheSearch from './PenicheSearch';
import Correction from './Correction';


export default function EssaiCompensationSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleTriState = (baseField, value) => {
    onChange({
      ...data,
      [`${baseField}_up`]: value === 'up',
      [`${baseField}_equal`]: value === 'equal',
      [`${baseField}_down`]: value === 'down'
    });
  };

  const acuiteRows = [
    { label: 'AV VL', fields: ['av_vl_odg', 'av_vl_od', 'av_vl_og'] },
    { label: 'AV VP', fields: ['av_vp_odg', 'av_vp_od', 'av_vp_og'] }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Essai de compensation" icon={TestTube2} />

      {/* Ancienne correction */}
      <div className="p-4 rounded-xl border bg-slate-50 space-y-4">
        <div className="font-semibold">Ancienne correction</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TouchInput
            label="Date facture dernier équipement"
            type="date"
            value={data.date_ancien_equipement}
            onChange={(v) => handleChange('date_ancien_equipement', v)}
          />

          {/* 2. Type de verres portés */}
          <div className="p-4 rounded-xl border bg-muted/30">
            <div className="font-medium mb-3">Type d’équipement</div>
            <TouchToggle
              options={[
                { value: "Unifocal", label: "Unifocal" },
                { value: "Progressif", label: "Progressif" },
              ]}
              value={data.type_verres_ancien || ""}
              onChange={(v) => handleChange('type_verres_ancien', v)}
            />
          </div>
        </div>

        <TouchInput
          label="Correction ancienne OD / OG"
          value={data.correction_ancienne}
          onChange={(v) => handleChange('correction_ancienne', v)}
          placeholder="Notation rapide"
        />
      </div>

      {/* Nouvelle correction */}
      <div className="p-4 rounded-xl border bg-white space-y-4">
        <div className="font-semibold">Nouvelle correction</div>

        <TouchInput
          label="Correction nouvelle OD / OG"
          value={data.correction_nouvelle}
          onChange={(v) => handleChange('correction_nouvelle', v)}
        />

        <Correction
          title="Correction"
          data={data}
          onChange={onChange}
          fieldPrefix="nouvelle"
        />

        <DataGrid
          title="Acuités visuelles (/10 – noter de 0 à 20)"
          headers={['ODG', 'OD', 'OG']}
          rows={acuiteRows}
          data={data}
          onChange={handleChange}
        />
      </div>

      {/* Tests faces à main */}
      <div className="p-4 rounded-xl border bg-white space-y-4">
        <div className="font-semibold">Tests complémentaires</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border rounded-xl space-y-2">
            <div className="font-medium">Test +0.25</div>
            <div className="flex gap-4">
              <TouchCheckbox
                label="⬆️ Acuité montée"
                checked={data.test_025_up}
                onChange={() => handleTriState('test_025', 'up')}
              />
              <TouchCheckbox
                label="➖ Acuité stable"
                checked={data.test_025_equal}
                onChange={() => handleTriState('test_025', 'equal')}
              />
              <TouchCheckbox
                label="⬇️ Acuité chute"
                checked={data.test_025_down}
                onChange={() => handleTriState('test_025', 'down')}
              />
            </div>
          </div>
        </div>

        <div className="p-3 border rounded-xl space-y-2">
          <div className="font-medium">Test +0.50</div>
          <div className="flex gap-4">
            <TouchCheckbox
              label="⬆️ Acuité montée"
              checked={data.test_05_up}
              onChange={() => handleTriState('test_05', 'up')}
            />
            <TouchCheckbox
              label="➖ Acuité stable"
              checked={data.test_05_equal}
              onChange={() => handleTriState('test_05', 'equal')}
            />
            <TouchCheckbox
              label="⬇️ Acuité chute"
              checked={data.test_05_down}
              onChange={() => handleTriState('test_05', 'down')}
            />
          </div>
        </div>
      </div>

      {/* Affectation de péniche */}
      <div className="p-4 rounded-xl border bg-white space-y-4">
        <div className="font-semibold">Affectation de péniche</div>
        <PenicheSearch data={data} onChange={onChange} />
      </div>

    </div>
  );
}
