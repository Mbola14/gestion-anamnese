import React from "react";
import { ClipboardList, Eye } from "lucide-react";
import SectionHeader from "../SectionHeader";
import TouchInput from "../TouchInput";
import TouchTextarea from "../TouchTextarea";
import TouchCheckbox from "../TouchCheckbox";
import TouchToggle from "../TouchToggle";

export default function InfosGenerales({ data, onChange }) {
  const handleChange = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-6">
      <SectionHeader title="Informations générales" icon={ClipboardList} />

      {/* 2. Type d’équipement */}
      <div className="p-4 rounded-xl border bg-muted/30">
        <div className="font-medium mb-3">Type d’équipement</div>
        <TouchToggle
          options={[
            { value: "premiere_lunette", label: "1ère lunette" },
            { value: "premier_progressif", label: "1er progressif" },
            { value: "renouvellement", label: "Renouvellement" },
          ]}
          value={data.type_equipement || ""}
          onChange={(v) => handleChange("type_equipement", v)}
        />
      </div>

      {/* 1. Écarts pupillaires */}
      <TouchInput
        label="Écarts pupillaires (OD / OG)"
        value={data.ecarts_pupillaires || ""}
        onChange={(v) => handleChange("ecarts_pupillaires", v)}
        placeholder="Ex : 31/32"
      />

      {/* 2. Motif de la visite en boutique */}
      <div className="space-y-3">
        <div className="font-medium">Motif de la visite en boutique</div>
        <TouchInput
          label="Quel est le motif de votre visite chez l’ophtalmologiste ?"
          value={data.motif_visite_boutique || ""}
          onChange={(v) => handleChange("motif_visite_boutique", v)}
          placeholder="Ex : je ne voyais plus bien de près…"
        />

        <div className="p-4 rounded-xl border">
          <div className="font-medium mb-2">Autre raison</div>
          <div className="flex flex-wrap gap-3">
            <TouchCheckbox
              label="Qualissime"
              checked={!!data.autre_raison_qualissime}
              onChange={(v) => handleChange("autre_raison_qualissime", v)}
            />
            <TouchCheckbox
              label="Perte de vos lunettes"
              checked={!!data.autre_raison_perte_lunettes}
              onChange={(v) => handleChange("autre_raison_perte_lunettes", v)}
            />
          </div>
        </div>
      </div>

      {/* 3. Informations issues de la visite ophtalmologique */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-800">
            Informations issues de la visite ophtalmologique
          </span>
        </div>

        <TouchTextarea
          label="Comment va votre santé oculaire ?"
          value={data.sante_oculaire || ""}
          onChange={(v) => handleChange("sante_oculaire", v)}
          placeholder="Indication : FO / PIO (tension oculaire), fond d’œil…"
          rows={3}
        />
      </div>

      {/* 4. Orthoptie */}
      <TouchTextarea
        label="Avez-vous déjà fait des exercices d’orthoptie ? Si oui, pourquoi."
        value={data.orthoptie || ""}
        onChange={(v) => handleChange("orthoptie", v)}
        placeholder="Ex : oui, pour… / non"
        rows={3}
      />

      {/* 5. Port de lentilles */}
      <div className="p-4 rounded-xl border bg-muted/20">
        <div className="font-medium mb-3">Port de lentilles</div>
        <TouchToggle
          options={[
            { value: "non", label: "Non" },
            { value: "occasionnel", label: "Occasionnel" },
            { value: "regulier", label: "Régulier" },
          ]}
          value={data.port_lentilles || ""}
          onChange={(v) => handleChange("port_lentilles", v)}
        />
      </div>

      {/* 6. Sentez-vous vos yeux ? */}
      <TouchTextarea
        label="Sentez-vous vos yeux ?"
        value={data.sentez_vos_yeux || ""}
        onChange={(v) => handleChange("sentez_vos_yeux", v)}
        placeholder="Ex : fatigue visuelle, sécheresse, picotements, gêne, inconfort…"
        rows={3}
      />
    </div>
  );
}
