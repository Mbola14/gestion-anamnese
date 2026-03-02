import React from "react";
import { User, Calendar } from "lucide-react";
import SectionHeader from "../SectionHeader";
import TouchInput from "../TouchInput";
import TouchToggle from "../TouchToggle";
import ContactSearch from "../sections/ContactSearch";

export default function IdentificationSection({ data, onChange, opticians = [] }) {
  const setField = (field, value) =>
    onChange((prev) => ({ ...prev, [field]: value }));

  const isNewClient = data.nouveau_client !== false; // true par défaut

  return (
    <div className="space-y-6">
      <SectionHeader title="Informations personnelles" icon={User} />

      {/* Nouveau client ? */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5" />
            <span className="font-medium">
              Votre client est-il un nouveau client ?
            </span>
          </div>
          <TouchToggle
            options={[
              { value: true, label: "Oui" },
              { value: false, label: "Non" },
            ]}
            value={typeof data.nouveau_client === "boolean" ? data.nouveau_client : true}
            onChange={(v) => {
              const val = v === true || v === "true";
              setField("nouveau_client", val);

              // reset contact si on repasse à "nouveau client"
              if (val) {
                setField("contact_id", "");
                setField("contact_search", "");
              }
            }}
          />
        </div>
      </div>

      {/* CLIENT EXISTANT : recherche contact */}
      {!isNewClient && (
        <ContactSearch data={data} onChange={onChange} />
      )}

      {/* NOUVEAU CLIENT : saisie manuelle */}
      {isNewClient && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TouchInput
              label="Nom *"
              value={data.nom || ""}
              onChange={(v) => setField("nom", v)}
              placeholder="Nom du client"
              size="large"
              required
            />
            <TouchInput
              label="Prénom *"
              value={data.prenom || ""}
              onChange={(v) => setField("prenom", v)}
              placeholder="Prénom du client"
              size="large"
              required
            />
            <TouchInput
              label="Email *"
              value={data.email || ""}
              onChange={(v) => setField("email", v)}
              placeholder="email@exemple.com"
              type="email"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TouchInput
              label="Date de naissance *"
              value={data.date_naissance || ""}
              onChange={(v) => setField("date_naissance", v)}
              type="date"
            />
          </div>
        </>
      )}

      {/* Suivi de la visite */}
      <SectionHeader title="Suivi de la visite" icon={Calendar} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchInput
          label="Date de visite"
          value={data.date_visite || ""}
          onChange={(v) => setField("date_visite", v)}
          type="date"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Opticien</label>
          <select
            className="w-full rounded-xl border px-3 py-3 bg-background"
            value={data.opticien_visite || ""}
            onChange={(e) => setField("opticien_visite", e.target.value)}
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
