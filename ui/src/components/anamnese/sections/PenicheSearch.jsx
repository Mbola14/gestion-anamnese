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
    // ✅ Sécurise le trim même si data.peniche est un nombre
    const q = String(data.peniche ?? "").trim();

    if (selectedRef.current && q === String(selectedRef.current.label ?? "").trim()) {
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

      const func_name = "search_peniche";
      const req_data = {
        arguments: JSON.stringify({ num_peniche: q }),
      };

      ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
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
            console.error("Erreur parsing output :", output);
            console.error("Erreur parsing péniche :", e);
            setResults([]);
            return;
          }

          const arr = Array.isArray(parsed?.data) ? parsed.data : [];

          const mapped = arr
            .filter((p) => p?.id)
            .map((p) => ({
              id: p.id,
              // ✅ Deal_Name peut être "Péniche N° 102" OU 102 (number) -> on force string
              label: String(p.Deal_Name ?? "Péniche"),
              stage: String(p.Stage ?? ""),
              libre: p.Libre === true, // absent => false
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
        value={String(data.peniche ?? "")} // ✅ toujours string
        onChange={(v) => setField("peniche", String(v ?? ""))} // ✅ toujours string
        placeholder="Tapez au moins 2 caractères…"
      />

      {selectedId && (data.peniche || selectedLabel) && (
        <div className="rounded-xl border p-3 bg-muted/20 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Péniche sélectionnée</div>
            <div className="font-medium">{String(data.peniche || selectedLabel)}</div>
            <div className="text-xs text-muted-foreground">ID : {selectedId}</div>
          </div>

          <button
            type="button"
            className="text-xs underline"
            onClick={() => {
              selectedRef.current = null;
              setField("peniche_id", "");
              setResults([]);
            }}
          >
            Changer
          </button>
        </div>
      )}

      {isSearching && <div className="text-xs text-muted-foreground">Recherche…</div>}

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
                    peniche_id: r.id,
                    peniche: String(r.label ?? ""), // ✅ force string
                    libre: r.libre, // ✅ pas r.Libre
                  }));

                  setResults([]);
                }}
              >
                <div className="font-medium">{r.label}</div>

                {r.stage && (
                  <div className="text-xs text-muted-foreground">Statut : {r.stage}</div>
                )}

                <div className="text-xs text-muted-foreground">ID : {r.id}</div>

                <div className="text-xs text-muted-foreground">
                  Libre : {r.libre ? "Oui" : "Non"}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {!isSearching &&
        String(data.peniche ?? "").trim().length >= 2 &&
        results.length === 0 &&
        !(
          selectedRef.current &&
          String(data.peniche ?? "").trim() === String(selectedRef.current.label ?? "").trim()
        ) && <div className="text-xs text-muted-foreground">Aucun résultat.</div>}
    </div>
  );
}