import React, { useMemo } from "react";
import { User, Calendar, ExternalLink } from "lucide-react";
import SectionHeader from "../SectionHeader";
import TouchInput from "../TouchInput";

export default function EditIdentificationSection({ data, onChange, opticians = [] }) {
  const handleChange = (field, value) => onChange({ ...data, [field]: value });

  const contactId = data?.contact_id || data?.Contact?.id || "";
  const contactName = data?.Contact?.name || "";
  const contactUrl = useMemo(() => {
    if (!contactId) return null;
    return `https://crm.zoho.eu/crm/org20079892132/tab/Contacts/${contactId}`;
  }, [contactId]);

  const fullName = useMemo(() => {
    const prenom = (data?.prenom || data?.Pr_nom || "").trim();
    const nom = (data?.nom || data?.Nom || "").trim();
    return [prenom, nom].filter(Boolean).join(" ");
  }, [data?.prenom, data?.Pr_nom, data?.nom, data?.Nom]);

  return (
    <div className="space-y-6">
      <SectionHeader title="Informations personnelles" icon={User} />

      {/* Client (lecture seule) */}
      <div className="rounded-xl border p-4 bg-muted/20">
        <div className="text-sm text-muted-foreground mb-1">Client</div>

        {contactUrl ? (
          <a
            href={contactUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-base text-blue-700 hover:underline"
          >
            {contactName || "Ouvrir le contact"}
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <div className="font-semibold text-base">{contactName || "Client non renseigné"}</div>
        )}  
      </div>

      {/* Suivi de la visite */}
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
            value={data.opticien_visite || ""}
            onChange={(e) => handleChange("opticien_visite", e.target.value)}
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
      </div>
    </div>
  );
}