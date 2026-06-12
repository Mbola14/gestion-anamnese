import React, { useEffect, useRef, useState } from "react";
import TouchInput from "../TouchInput";

export default function PenicheSearch({ data, onChange }) {
  const setField = (field, value) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debounceRef = useRef(null);
  const lastQueryRef = useRef("");
  const selectedRef = useRef(null);

  useEffect(() => {
    const q = (data.peniche || "").trim();

    // Si déjà sélectionné et texte identique => pas de recherche
    if (selectedRef.current && q === (selectedRef.current.label || "").trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setResults([]);
    setIsSearching(false);

    if (q.length < 2) {
      lastQueryRef.current = q;
      return;
    }

    if (q === lastQueryRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      lastQueryRef.current = q;
      setIsSearching(true);

      ZOHO.CRM.FUNCTIONS.execute("search_peniche", {
        arguments: JSON.stringify({ num_peniche: q }),
      })
        .then((resp) => {
          const output = resp?.details?.output;
          if (!output) {
            setResults([]);
            return;
          }

          let parsed;
          try {
            parsed = typeof output === "string" ? JSON.parse(output) : output;
          } catch (e) {
            console.error("Erreur parsing péniche :", e);
            setResults([]);
            return;
          }

          const arr = Array.isArray(parsed?.data) ? parsed.data : [];

          const mapped = arr
            .filter((p) => p?.id)
            .map((p) => ({
              id: p.id,
              label: String(p.Deal_Name ?? "Péniche"),
              stage: String(p.Stage ?? ""),
              // ✅ Libre = true si vient de N_Péniches (pas de Stage = pas de Deal)
              libre: p.Libre === true,
              // ✅ Numéro brut : depuis N_de_p_niche ou extrait du nom "Péniche N° 603"
              numero: p.N_de_p_niche
                ? String(p.N_de_p_niche)
                : String(p.Deal_Name ?? "").replace(/[^0-9]/g, ""),
            }));

          setResults(mapped);
        })
        .catch((e) => {
          console.error("Erreur search_peniche :", e);
          setResults([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data.peniche]);

  const selectedId = data.peniche_id || "";
  const selectedLabel = selectedRef.current?.label || "";

  return (
    <div className="p-4 rounded-xl border bg-white space-y-3">
      <div className="font-semibold">Affectation de péniche</div>

      <TouchInput
        label="Péniche"
        value={data.peniche || ""}
        onChange={(v) => {
          // Si l'utilisateur retape, on efface la sélection précédente
          onChange((prev) => ({
            ...prev,
            peniche: v,
            peniche_id: "",
            peniche_libre: false,
            libre: false,
            peniche_numero: "",
          }));
          selectedRef.current = null;
        }}
        placeholder="Tapez au moins 2 caractères…"
      />

      {/* Péniche sélectionnée */}
      {selectedId && (data.peniche || selectedLabel) && (
        <div className="rounded-xl border p-3 bg-muted/20 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Péniche sélectionnée</div>
            <div className="font-medium">{data.peniche || selectedLabel}</div>
            {data.peniche_libre && (
              <div className="text-xs text-green-600 font-medium mt-0.5">
                ✓ Péniche libre — un Deal sera créé à l'enregistrement
              </div>
            )}
          </div>
          <button
            type="button"
            className="text-xs underline shrink-0"
            onClick={() => {
              selectedRef.current = null;
              onChange((prev) => ({
                ...prev,
                peniche: "",
                peniche_id: "",
                peniche_libre: false,
                libre: false,
                peniche_numero: "",
              }));
              setResults([]);
            }}
          >
            Changer
          </button>
        </div>
      )}

      {isSearching && (
        <div className="text-xs text-muted-foreground">Recherche…</div>
      )}

      {results.length > 0 && (
        <div className="rounded-xl border overflow-hidden">
          {results.map((r) => {
            const isSelected = selectedId && r.id === selectedId;

            return (
              <button
                key={r.id}
                type="button"
                className={[
                  "w-full text-left px-3 py-2 hover:bg-muted/40",
                  isSelected ? "bg-muted/30" : "",
                ].join(" ")}
                onClick={() => {
                  selectedRef.current = r;

                  onChange((prev) => ({
                    ...prev,
                    peniche_id: String(r.id),
                    peniche: String(r.label ?? ""),
                    // ✅ Utilisé par NouvelleFiche
                    peniche_libre: r.libre ?? false,
                    peniche_numero: r.numero ?? "",
                    // ✅ Utilisé par EditerFiche (même clé que dans EditerFiche.jsx)
                    libre: r.libre ?? false,
                  }));

                  setResults([]);
                }}
              >
                <div className="font-medium">{r.label}</div>
                {r.stage && (
                  <div className="text-xs text-muted-foreground">
                    Statut : {r.stage}
                  </div>
                )}
                {r.libre && (
                  <div className="text-xs text-green-600 font-medium">
                    ✓ Péniche libre
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!isSearching &&
        (data.peniche || "").trim().length >= 2 &&
        results.length === 0 &&
        !(
          selectedRef.current &&
          (data.peniche || "").trim() ===
            (selectedRef.current.label || "").trim()
        ) && (
          <div className="text-xs text-muted-foreground">Aucun résultat.</div>
        )}
    </div>
  );
}
