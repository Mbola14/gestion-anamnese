import React from "react";
import { User, Calendar } from "lucide-react";
import SectionHeader from "../SectionHeader";
import TouchInput from "../TouchInput";
import TouchToggle from "../TouchToggle";

export default function IdentificationSection({ data, onChange, opticians = [] }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Informations personnelles" icon={User} />

      {/* 1) Nom / Prénom / Email / Date de naissance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchInput
          label="Nom *"
          value={data.nom || ""}
          onChange={(v) => handleChange("nom", v)}
          placeholder="Nom du client"
          size="large"
          required
        />
        <TouchInput
          label="Prénom *"
          value={data.prenom || ""}
          onChange={(v) => handleChange("prenom", v)}
          placeholder="Prénom du client"
          size="large"
          required
        />
        <TouchInput
          label="Email *"
          value={data.email || ""}
          onChange={(v) => handleChange("email", v)}
          placeholder="email@exemple.com"
          type="email"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchInput
          label="Date de naissance"
          value={data.date_naissance || ""}
          onChange={(v) => handleChange("date_naissance", v)}
          type="date"
        />

        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5" />
            <span className="font-medium">Votre client est-il un nouveau client ?</span>
          </div>
          <TouchToggle
            options={[
              { value: true, label: "Oui" },
              { value: false, label: "Non" },
            ]}
            value={typeof data.nouveau_client === "boolean" ? data.nouveau_client : false}
            onChange={(v) => handleChange("nouveau_client", v === true || v === "true")}
          />
        </div>
      </div>

      {/* 4) Suivi de la visite */}
      <SectionHeader title="Suivi de la visite" icon={Calendar} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchInput
          label="Date de visite"
          value={data.date_visite || ""}
          onChange={(v) => handleChange("date_visite", v)}
          type="date"
        />

        {/* Opticien = liste déroulante */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Opticien</label>
          <select
            className="w-full rounded-xl border px-3 py-3 bg-background"
            value={data.opticien || ""}
            onChange={(e) => handleChange("opticien", e.target.value)}
          >
            <option value="" disabled>
              Choisir un opticien…
            </option>
            {opticians.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Liste déroulante avec les prénoms des opticiens de la boutique.
          </p>
        </div>
      </div>
    </div>
  );
}
