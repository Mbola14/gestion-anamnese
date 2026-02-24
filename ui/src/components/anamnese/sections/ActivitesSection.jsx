import React from "react";
import { Activity, Car, Monitor, BookOpen } from "lucide-react";
import SectionHeader from "../SectionHeader";
import TouchCheckbox from "../TouchCheckbox";
import TouchInput from "../TouchInput";
import TouchToggle from "../TouchToggle";

const VL_FIELDS = [
  { key: "vl_conduite_auto", label: "Conduite automobile" },
  { key: "vl_conduite_nuit", label: "Conduite de nuit" },
  { key: "vl_marche_exterieur", label: "Marche / déplacements extérieurs" },
  { key: "vl_velo_deuxroues", label: "Vélo / deux-roues" },
  { key: "vl_sport_exterieur", label: "Sport extérieur" },
  { key: "vl_voyage", label: "Voyage / déplacements fréquents" },
  { key: "vl_observation_distance", label: "Observation à distance (paysage, surveillance)" },
  { key: "vl_lecture_panneaux", label: "Lecture de panneaux / signalisation" },
];

const VI_FIELDS = [
  { key: "vi_ordinateur_fixe", label: "Ordinateur (poste fixe)" },
  { key: "vi_ordinateur_portable", label: "Ordinateur portable" },
  { key: "vi_double_ecran", label: "Double écran" },
  { key: "vi_ecran_prolonge", label: "Travail sur écran prolongé" },
  { key: "vi_television", label: "Télévision" },
  { key: "vi_cuisine", label: "Cuisine" },
  { key: "vi_bricolage", label: "Bricolage" },
  { key: "vi_atelier", label: "Atelier / activité manuelle" },
  { key: "vi_enseignement", label: "Enseignement / présentation" },
  { key: "vi_commerce", label: "Commerce / accueil client" },
];

const VP_FIELDS = [
  { key: "vp_lecture_intensive", label: "Lecture intensive" },
  { key: "vp_lecture_occasionnelle", label: "Lecture occasionnelle" },
  { key: "vp_smartphone", label: "Téléphone / smartphone" },
  { key: "vp_tablette", label: "Tablette" },
  { key: "vp_ecriture", label: "Écriture" },
  { key: "vp_etude", label: "Étude / révision" },
  { key: "vp_couture_tricot", label: "Couture / tricot" },
  { key: "vp_dessin_peinture", label: "Dessin / peinture" },
  { key: "vp_precision", label: "Activités de précision" },
];

export default function ActivitesSection({ data, onChange }) {
  const handleChange = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-6">
      <SectionHeader title="Activités visuelles" icon={Activity} />

      {/* 🎯 Zone dominante (manuel) */}
      <div className="rounded-xl border p-4 bg-muted/30 space-y-3">
        <div className="font-medium">Zone dominante</div>
        <TouchToggle
          options={[
            { value: "VL (Vision de loin)", label: "VL (Vision de loin)" },
            { value: "VI (Vision intermédiaire)", label: "VI (Vision intermédiaire)" },
            { value: "VP (Vision de près)", label: "VP (Vision de près)" },
            { value: "Vision progressive", label: "Vision progressive" },
          ]}
          value={data.zone_dominante || ""}
          onChange={(v) => handleChange("zone_dominante", v)}
        />
      </div>

      {/* 1️ VL */}
      <div className="p-4 rounded-xl border bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
        <div className="flex items-center gap-2 mb-4">
          <Car className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-emerald-800">VL - Vision de loin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VL_FIELDS.map((f) => (
            <TouchCheckbox
              key={f.key}
              label={f.label}
              checked={!!data?.[f.key]}
              onChange={(v) => handleChange(f.key, v)}
            />
          ))}
        </div>

        <div className="mt-4">
          <TouchInput
            label="Autres activités VL"
            value={data.autres_activites_vl || ""}
            onChange={(v) => handleChange("autres_activites_vl", v)}
            placeholder="Champ texte libre…"
          />
        </div>
      </div>

      {/* 2️ VI */}
      <div className="p-4 rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-800">VI - Vision intermédiaire</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VI_FIELDS.map((f) => (
            <TouchCheckbox
              key={f.key}
              label={f.label}
              checked={!!data?.[f.key]}
              onChange={(v) => handleChange(f.key, v)}
            />
          ))}
        </div>

        <div className="mt-4">
          <TouchInput
            label="Autres activités VI"
            value={data.autres_activites_vi || ""}
            onChange={(v) => handleChange("autres_activites_vi", v)}
            placeholder="Champ texte libre…"
          />
        </div>
      </div>

      {/* 3️ VP */}
      <div className="p-4 rounded-xl border bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-800">VP - Vision de près</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VP_FIELDS.map((f) => (
            <TouchCheckbox
              key={f.key}
              label={f.label}
              checked={!!data?.[f.key]}
              onChange={(v) => handleChange(f.key, v)}
            />
          ))}
        </div>

        <div className="mt-4">
          <TouchInput
            label="Autres activités VP"
            value={data.autres_activites_vp || ""}
            onChange={(v) => handleChange("autres_activites_vp", v)}
            placeholder="Champ texte libre…"
          />
        </div>
      </div>
    </div>
  );
}
