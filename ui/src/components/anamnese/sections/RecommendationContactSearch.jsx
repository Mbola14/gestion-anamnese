import React, { useEffect, useRef, useState } from "react";
import TouchInput from "../TouchInput";

export default function RecommendationContactSearch({ data, onChange }) {
    const setField = (field, value) => onChange((prev) => ({ ...prev, [field]: value }));

    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const debounceRef = useRef(null);
    const lastQueryRef = useRef("");

    // ✅ Si un contact est déjà sélectionné, on affiche le résumé
    const isSelected = !!data.recommande_par_id;

    const handleClear = () => {
        onChange((prev) => ({
            ...prev,
            recommande_par_id: null,
            contact_search_reco: "",
        }));
        lastQueryRef.current = "";
        setResults([]);
    };

    useEffect(() => {
        if (isSelected) return; // ✅ bloque la recherche si déjà sélectionné

        const q = (data.contact_search_reco || "").trim();

        setResults([]);
        setIsSearching(false);

        if (q.length < 1) {
            lastQueryRef.current = q;
            return;
        }

        if (q === lastQueryRef.current) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            lastQueryRef.current = q;
            setIsSearching(true);

            const func_name = "search_contact";
            const req_data = {
                arguments: JSON.stringify({ search_term: q }),
            };

            ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
                .then((resp) => {
                    const output = resp?.details?.output;
                    if (!output) { setResults([]); return; }

                    let parsed;
                    try {
                        parsed = typeof output === "string" ? JSON.parse(output) : output;
                    } catch (e) {
                        setResults([]);
                        return;
                    }

                    const arr = Array.isArray(parsed?.data) ? parsed.data : [];
                    const mapped = arr
                        .filter((c) => c?.id)
                        .map((c) => ({
                            id: c.id,
                            label: c.Full_Name || `${c.First_Name || ""} ${c.Last_Name || ""}`.trim() || "Contact",
                            email: c.Email || "",
                        }));

                    setResults(mapped);
                })
                .catch(() => setResults([]))
                .finally(() => setIsSearching(false));
        }, 350);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [data.contact_search_reco, isSelected]);

    return (
        <div className="p-4 rounded-xl border bg-white space-y-3">
            <div className="font-semibold">Recommandé par</div>

            {/* ✅ Si contact sélectionné → afficher le résumé comme la péniche */}
            {isSelected ? (
                <div className="rounded-xl border px-4 py-3 bg-muted/20 space-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs text-muted-foreground mb-0.5">Contact sélectionné</div>
                            <div className="font-semibold text-sm">{data.contact_search_reco}</div>
                        </div>
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:underline"
                            onClick={handleClear}
                        >
                            Changer
                        </button>
                    </div>
                </div>
            ) : (
                // ✅ Sinon → afficher le champ de recherche
                <>
                    <TouchInput
                        label="Nom / Prénom"
                        value={data.contact_search_reco || ""}
                        onChange={(v) => setField("contact_search_reco", v)}
                        placeholder="Tapez au moins 2 caractères…"
                    />

                    {isSearching && <div className="text-xs text-muted-foreground">Recherche…</div>}

                    {results.length > 0 && (
                        <div className="rounded-xl border overflow-hidden">
                            {results.map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    className="w-full text-left px-3 py-2 hover:bg-muted/40"
                                    onClick={() => {
                                        onChange((prev) => ({
                                            ...prev,
                                            recommande_par_id: r.id,
                                            contact_search_reco: r.label,
                                        }));
                                        setResults([]);
                                    }}
                                >
                                    <div className="font-medium">{r.label}</div>
                                    <div className="text-xs text-muted-foreground">{r.email || "—"}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {!isSearching && (data.contact_search_reco || "").trim().length >= 2 && results.length === 0 && (
                        <div className="text-xs text-muted-foreground">Aucun résultat.</div>
                    )}
                </>
            )}
        </div>
    );
}