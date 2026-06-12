import React, { useMemo, useRef, useLayoutEffect } from "react";

const FIELDS = [
  { key: "sphere", label: "Sphère", placeholder: "0.00", inputMode: "decimal" },
  { key: "cylindre", label: "Cylindre", placeholder: "0.00", inputMode: "decimal" },
  { key: "axe", label: "Axe", placeholder: "0", inputMode: "numeric" },
  { key: "addition", label: "Addition", placeholder: "0.00", inputMode: "decimal" },
  { key: "prisme1", label: "Prisme 1", placeholder: "0", inputMode: "decimal" },
  { key: "base1", label: "Base 1", placeholder: "0", inputMode: "numeric" },
  { key: "prisme2", label: "Prisme 2", placeholder: "0", inputMode: "decimal" },
  { key: "base2", label: "Base 2", placeholder: "0", inputMode: "numeric" },
];

export default function Correction({
  title = "Correction",
  data,
  onChange,
  fieldPrefix = "ancienne",
}) {
  const rootRef = useRef(null);
  const scrollerODRef = useRef(null);
  const scrollerOGRef = useRef(null);
  const scrollLeftRef = useRef({ od: 0, og: 0 });

  const makeKey = (eye, field) => `${fieldPrefix}_${eye}_${field}`;

  const values = useMemo(() => {
    const read = (eye) =>
      FIELDS.reduce((acc, f) => {
        acc[f.key] = data?.[makeKey(eye, f.key)] ?? "";
        return acc;
      }, {});
    return { od: read("od"), og: read("og") };
  }, [data, fieldPrefix]);

  useLayoutEffect(() => {
    if (scrollerODRef.current) scrollerODRef.current.scrollLeft = scrollLeftRef.current.od;
    if (scrollerOGRef.current) scrollerOGRef.current.scrollLeft = scrollLeftRef.current.og;
  });

  const update = (eye, field, value) => {
    const node = rootRef.current;
    const active = document.activeElement;
    
    // Sauvegarde de l'état du curseur
    const focusInfo = active && node && node.contains(active) ? {
      name: active.getAttribute("name"),
      start: active.selectionStart,
      end: active.selectionEnd,
    } : null;

    const scroller = eye === "od" ? scrollerODRef.current : scrollerOGRef.current;
    if (scroller) scrollLeftRef.current[eye] = scroller.scrollLeft;

    const k = makeKey(eye, field);
    
    // ✅ CORRECTION 1: Remplacement automatique de la virgule par un point
    let formattedValue = typeof value === "string" ? value.replace(",", ".") : value;

    onChange((prev) => ({ ...prev, [k]: formattedValue }));

    requestAnimationFrame(() => {
      if (focusInfo?.name && node) {
        const input = node.querySelector(`[name="${CSS.escape(focusInfo.name)}"]`);
        if (input) {
          input.focus({ preventScroll: true });
          try { input.setSelectionRange(focusInfo.start, focusInfo.end); } catch {}
        }
      }
    });
  };

  const Field = ({ eyeKey, label, field, placeholder = "", inputMode }) => {
    const k = makeKey(eyeKey, field);
    const rawValue = String(values?.[eyeKey]?.[field] ?? "");

    // ✅ CORRECTION 2: Gestion du signe Cylindre
    // On permet à l'utilisateur de cliquer sur le signe pour basculer +/-
    const toggleSign = () => {
        if (!rawValue || rawValue === "0") return;
        const numericValue = parseFloat(rawValue);
        update(eyeKey, field, String(numericValue * -1));
    };

    return (
      <div className="w-[84px] shrink-0">
        <label className="block text-xs text-muted-foreground whitespace-nowrap mb-1">
          {label}
        </label>

        <div className="relative flex items-center">
          {field === "cylindre" && (
            <button 
              type="button"
              onClick={toggleSign}
              className="absolute left-1.5 z-10 h-6 w-5 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold transition-colors"
              title="Changer le signe"
            >
              {rawValue.startsWith("-") ? "−" : "+"}
            </button>
          )}

          <input
            name={k}
            className={`w-full rounded-xl border px-2 py-2 bg-background transition-all focus:ring-1 focus:ring-blue-500 outline-none ${
              field === "cylindre" ? "pl-7" : ""
            }`}
            type="text"
            inputMode={inputMode}
            value={rawValue}
            placeholder={placeholder}
            onChange={(e) => {
              let v = e.target.value;
              
              // Bloquer les caractères non numériques (sauf point, virgule et moins au début)
              if (/[^0-9.,-]/.test(v)) return;

              update(eyeKey, field, v);
            }}
          />
        </div>
      </div>
    );
  };

  const EyeRow = ({ eyeLabel, eyeKey, scrollerRef }) => (
    <div className="flex items-start gap-3">
      <div className="w-10 shrink-0 font-semibold text-sm pt-7">{eyeLabel}</div>
      <div
        ref={scrollerRef}
        className="overflow-x-auto pb-2 min-w-0"
        onScroll={(e) => { scrollLeftRef.current[eyeKey] = e.currentTarget.scrollLeft; }}
      >
        <div className="flex gap-3 min-w-max">
          {FIELDS.map((f) => (
            <Field
              key={f.key}
              eyeKey={eyeKey}
              label={f.label}
              field={f.key}
              placeholder={f.placeholder}
              inputMode={f.inputMode}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className="p-4 rounded-xl border bg-white shadow-sm space-y-4">
      <div className="font-semibold text-slate-800">{title}</div>
      <EyeRow eyeLabel="OD" eyeKey="od" scrollerRef={scrollerODRef} />
      <EyeRow eyeLabel="OG" eyeKey="og" scrollerRef={scrollerOGRef} />
    </div>
  );
}