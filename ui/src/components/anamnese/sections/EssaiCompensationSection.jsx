import React from 'react';
import { TestTube2 } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import DataGrid from '../DataGrid';
import TouchInput from '../TouchInput';
import TouchTextarea from '../TouchTextarea';

export default function EssaiCompensationSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleGridChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const acuiteRows = [
    { label: 'Acuité brute', fields: ['acuite_brute_odg', 'acuite_brute_od', 'acuite_brute_og'] },
    { label: 'AV VL', fields: ['av_vl_odg', 'av_vl_od', 'av_vl_og'] },
    { label: 'VP', fields: ['vp_odg', 'vp_od', 'vp_og'] }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Essai de Compensation" icon={TestTube2} />
      
      {/* Appréciation perceptuelle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchTextarea
          label="Appréciation perceptuelle - Statique"
          value={data.appreciation_statique}
          onChange={(v) => handleChange('appreciation_statique', v)}
          placeholder="Observations statiques..."
          rows={2}
        />
        <TouchTextarea
          label="Appréciation perceptuelle - Non statique"
          value={data.appreciation_non_statique}
          onChange={(v) => handleChange('appreciation_non_statique', v)}
          placeholder="Observations dynamiques..."
          rows={2}
        />
      </div>

      {/* Grille des acuités */}
      <DataGrid
        title="Acuités visuelles"
        headers={['ODG', 'OD', 'OG']}
        rows={acuiteRows}
        data={data}
        onChange={handleGridChange}
      />

      {/* Tests +0.25 et +0.5 */}
      <div className="grid grid-cols-2 gap-4">
        <TouchInput
          label="Test +0.25 AV"
          value={data.test_025_av}
          onChange={(v) => handleChange('test_025_av', v)}
          placeholder="Résultat"
        />
        <TouchInput
          label="Test +0.5 AV"
          value={data.test_05_av}
          onChange={(v) => handleChange('test_05_av', v)}
          placeholder="Résultat"
        />
      </div>

      <TouchInput
        label="OAB"
        value={data.oab}
        onChange={(v) => handleChange('oab', v)}
        placeholder="OAB"
      />

      {/* Parcours */}
      <div className="grid grid-cols-2 gap-4">
        <TouchInput
          label="Parcours min (cm)"
          value={data.parcours_min}
          onChange={(v) => handleChange('parcours_min', v)}
          placeholder="cm"
        />
        <TouchInput
          label="Parcours max (cm)"
          value={data.parcours_max}
          onChange={(v) => handleChange('parcours_max', v)}
          placeholder="cm"
        />
      </div>

      {/* Mk/Howel */}
      <div className="grid grid-cols-2 gap-4">
        <TouchInput
          label="Mk/Howel VP"
          value={data.mkhowel_vp}
          onChange={(v) => handleChange('mkhowel_vp', v)}
          placeholder=""
        />
        <TouchInput
          label="Mk/Howel VL"
          value={data.mkhowel_vl}
          onChange={(v) => handleChange('mkhowel_vl', v)}
          placeholder=""
        />
      </div>

      {/* Tests supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TouchInput
          label="PPC"
          value={data.ppc}
          onChange={(v) => handleChange('ppc', v)}
          placeholder=""
        />
        <TouchInput
          label="Recouvrement"
          value={data.recouvrement}
          onChange={(v) => handleChange('recouvrement', v)}
          placeholder=""
        />
        <TouchInput
          label="Qualité"
          value={data.qualite}
          onChange={(v) => handleChange('qualite', v)}
          placeholder=""
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TouchInput
          label="Malett Fusion"
          value={data.malett_fusion}
          onChange={(v) => handleChange('malett_fusion', v)}
          placeholder=""
        />
        <TouchInput
          label="DDF VL"
          value={data.ddf_vl}
          onChange={(v) => handleChange('ddf_vl', v)}
          placeholder=""
        />
        <TouchInput
          label="DDF VP"
          value={data.ddf_vp}
          onChange={(v) => handleChange('ddf_vp', v)}
          placeholder=""
        />
      </div>

      <TouchInput
        label="RV"
        value={data.rv}
        onChange={(v) => handleChange('rv', v)}
        placeholder=""
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchInput
          label="Rock prismatique VL (3BEXT&RINT)*3"
          value={data.rock_prismatique_vl}
          onChange={(v) => handleChange('rock_prismatique_vl', v)}
          placeholder=""
        />
        <TouchInput
          label="Rock prismatique VP (3(3RI/12BEXT))"
          value={data.rock_prismatique_vp}
          onChange={(v) => handleChange('rock_prismatique_vp', v)}
          placeholder=""
        />
      </div>
    </div>
  );
}