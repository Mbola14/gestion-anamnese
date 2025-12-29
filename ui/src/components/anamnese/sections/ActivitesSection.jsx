import React from 'react';
import { Activity, Car, Monitor, BookOpen } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import TouchCheckbox from '../TouchCheckbox';
import TouchInput from '../TouchInput';
import TouchTextarea from '../TouchTextarea';

export default function ActivitesSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Activités" icon={Activity} />
      
      {/* VL - Vision de Loin */}
      <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
        <div className="flex items-center gap-2 mb-4">
          <Car className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-emerald-800">VL - Vision de Loin</span>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <TouchCheckbox
              label="Conduite"
              checked={data.activites_vl_conduite}
              onChange={(v) => handleChange('activites_vl_conduite', v)}
            />
            <TouchCheckbox
              label="Marche avec lunettes"
              checked={data.activites_vl_marche}
              onChange={(v) => handleChange('activites_vl_marche', v)}
            />
          </div>
          <TouchInput
            label="Autres activités VL"
            value={data.activites_vl_autres}
            onChange={(v) => handleChange('activites_vl_autres', v)}
            placeholder="Sport, cinéma, TV..."
          />
        </div>
      </div>

      {/* VI - Vision Intermédiaire */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-800">VI - Vision Intermédiaire</span>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <TouchCheckbox
              label="Ordinateur"
              checked={data.activites_vi_ordinateur}
              onChange={(v) => handleChange('activites_vi_ordinateur', v)}
            />
            <TouchInput
              label="Distance écran"
              value={data.activites_vi_distance}
              onChange={(v) => handleChange('activites_vi_distance', v)}
              placeholder="50-70 cm"
              className="flex-1 min-w-[150px]"
            />
          </div>
          <TouchInput
            label="Autres activités VI"
            value={data.activites_vi_autres}
            onChange={(v) => handleChange('activites_vi_autres', v)}
            placeholder="Cuisine, bricolage..."
          />
        </div>
      </div>

      {/* VP - Vision de Près */}
      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-800">VP - Vision de Près</span>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <TouchCheckbox
              label="Lecture"
              checked={data.activites_vp_lecture}
              onChange={(v) => handleChange('activites_vp_lecture', v)}
            />
            <TouchCheckbox
              label="Téléphone"
              checked={data.activites_vp_telephone}
              onChange={(v) => handleChange('activites_vp_telephone', v)}
            />
            <TouchInput
              label="Distance"
              value={data.activites_vp_distance}
              onChange={(v) => handleChange('activites_vp_distance', v)}
              placeholder="30-40 cm"
              className="flex-1 min-w-[150px]"
            />
          </div>
          <TouchInput
            label="Autres activités VP"
            value={data.activites_vp_autres}
            onChange={(v) => handleChange('activites_vp_autres', v)}
            placeholder="Couture, dessin..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchInput
          label="Temps d'ordinateur (heures/jour)"
          value={data.temps_ordinateur}
          onChange={(v) => handleChange('temps_ordinateur', v)}
          placeholder="Ex: 6-8h"
        />
        <TouchInput
          label="Profession"
          value={data.profession}
          onChange={(v) => handleChange('profession', v)}
          placeholder="Profession du client"
        />
      </div>

      <TouchTextarea
        label="Remarques"
        value={data.remarques_anamnese}
        onChange={(v) => handleChange('remarques_anamnese', v)}
        placeholder="Remarques complémentaires sur les activités..."
        rows={3}
      />
    </div>
  );
}