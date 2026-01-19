import React, { useEffect, useRef, useState } from "react";
import TouchInput from "../TouchInput";

export default function ContactSearch({ data, onChange }) {
    const setField = (field, value) => onChange((prev) => ({ ...prev, [field]: value }));

    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const debounceRef = useRef(null);
    const lastQueryRef = useRef("");

    useEffect(() => {
        const q = (data.contact_search || "").trim();        

        // reset UI
        setResults([]);
        setIsSearching(false);

        // ✅ ne cherche que si >= 2 caractères
        if (q.length < 1) {
            lastQueryRef.current = q;
            return;
        }

        // ✅ éviter de relancer si même requête
        if (q === lastQueryRef.current) return;

        // ✅ debounce
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            lastQueryRef.current = q;
            setIsSearching(true);

            const func_name = "search_contact"; // ✅ ta fonction Deluge
            const req_data = {
                arguments: JSON.stringify({ search_term: q }),
            };
            console.log("REQ DATA : ", req_data);

            ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
                .then((resp) => {
                    console.log("RESPONSE SEARCH CONTACT : ", resp);
                    
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
                        console.error("Erreur parsing contacts :", e);
                        setResults([]);
                        return;
                    }

                    const arr = Array.isArray(parsed?.data) ? parsed.data : [];
                    const mapped = arr
                        .filter((c) => c?.id)
                        .map((c) => ({
                            id: c.id,
                            label: c.Full_Name || `${c.First_Name || ""} ${c.Last_Name || ""}`.trim() || "Contact",
                            firstName: c.First_Name || "",
                            lastName: c.Last_Name || "",
                            email: c.Email || "",
                        }));

                    setResults(mapped);
                })
                .catch((e) => {
                    console.error("Erreur search_contact :", e);
                    setResults([]);
                })
                .finally(() => {
                    setIsSearching(false);
                });
        }, 350);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [data.contact_search]);

    return (
        <div className="p-4 rounded-xl border bg-white space-y-3">
            <div className="font-semibold">Recherche client</div>

            <TouchInput
                label="Nom / Prénom"
                value={data.contact_search || ""}
                onChange={(v) => setField("contact_search", v)}
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
                                // ✅ sélection : on remplit le form
                                onChange((prev) => ({
                                    ...prev,
                                    contact_id: r.id,
                                    contact_search: r.label,
                                    nom: r.lastName || prev.nom,
                                    prenom: r.firstName || prev.prenom,
                                    email: r.email || prev.email,
                                }));
                                setResults([]);
                            }}
                        >
                            <div className="font-medium">{r.label}</div>
                            <div className="text-xs text-muted-foreground">
                                {r.email || "—"}
                                {r.dob ? ` • Naissance : ${r.dob}` : ""}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {!isSearching && (data.contact_search || "").trim().length >= 2 && results.length === 0 && (
                <div className="text-xs text-muted-foreground">Aucun résultat.</div>
            )}
        </div>
    );
}
