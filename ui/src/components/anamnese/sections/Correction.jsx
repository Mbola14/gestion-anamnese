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
  fieldPrefix = "nouvelle", // ✅ garde exactement ces keys: nouvelle_od_sphere, nouvelle_og_sphere, etc.
}) {
  const rootRef = useRef(null);

  const scrollerODRef = useRef(null);
  const scrollerOGRef = useRef(null);

  // ✅ mémorise la position scroll (pour éviter retour à gauche)
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

  // ✅ à CHAQUE rerender, on remet le scroll exactement où il était
  useLayoutEffect(() => {
    if (scrollerODRef.current)
      scrollerODRef.current.scrollLeft = scrollLeftRef.current.od;
    if (scrollerOGRef.current)
      scrollerOGRef.current.scrollLeft = scrollLeftRef.current.og;
  });

  const update = (eye, field, value) => {
    const node = rootRef.current;
    const active = document.activeElement;

    // ✅ capture focus + caret
    const focusInfo =
      active && node && node.contains(active)
        ? {
            name: active.getAttribute("name"),
            start: active.selectionStart,
            end: active.selectionEnd,
          }
        : null;

    // ✅ capture scroll juste avant update
    const scroller = eye === "od" ? scrollerODRef.current : scrollerOGRef.current;
    if (scroller) scrollLeftRef.current[eye] = scroller.scrollLeft;

    const k = makeKey(eye, field);

    // ✅ update sans casser ton mapping (nouvelle_od_* / nouvelle_og_*)
    onChange((prev) => ({ ...prev, [k]: value }));

    // ✅ restore focus après update (sans toucher au scroll ici)
    requestAnimationFrame(() => {
      if (focusInfo?.name && node) {
        const input = node.querySelector(
          `[name="${CSS.escape(focusInfo.name)}"]`
        );
        if (input) {
          input.focus({ preventScroll: true });
          if (typeof input.setSelectionRange === "function") {
            try {
              input.setSelectionRange(focusInfo.start ?? 0, focusInfo.end ?? 0);
            } catch {}
          }
        }
      }
    });
  };

  const normalizeNumber = (str) => {
    if (str == null) return null;
    const s = String(str).trim().replace(",", ".");
    if (!s) return null;
    const n = Number(s);
    if (Number.isNaN(n)) return null;
    return n;
  };

  const Field = ({ eyeKey, label, field, placeholder = "", inputMode }) => {
    const k = makeKey(eyeKey, field);
    const rawValue = values?.[eyeKey]?.[field] ?? "";

    // ✅ Cylindre: on AFFICHERA la valeur absolue (le signe - est un préfixe non éditable)
    const displayValue =
      field === "cylindre"
        ? rawValue === ""
          ? ""
          : String(Math.abs(Number(rawValue)) || "")
        : rawValue;

    return (
      <div className="w-[84px] shrink-0">
        <label className="block text-xs text-muted-foreground whitespace-nowrap mb-1">
          {label}
        </label>

        <div className="relative">
          {field === "cylindre" && (
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground select-none">
              −
            </span>
          )}

          <input
            name={k}
            className={`w-full rounded-xl border px-2 py-2 bg-background ${
              field === "cylindre" ? "pl-5" : ""
            }`}
            type="text"
            inputMode={inputMode}
            value={displayValue}
            placeholder={placeholder}
            onChange={(e) => {
              const v = e.target.value;

              if (field === "cylindre") {
                // ✅ stocke TOUJOURS un nombre négatif
                if (v.trim() === "") {
                  update(eyeKey, field, "");
                  return;
                }
                const n = normalizeNumber(v);
                if (n === null) return; // ignore saisie invalide
                update(eyeKey, field, -Math.abs(n));
                return;
              }

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
        style={{ WebkitOverflowScrolling: "touch" }}
        onScroll={(e) => {
          scrollLeftRef.current[eyeKey] = e.currentTarget.scrollLeft;
        }}
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
    <div ref={rootRef} className="p-4 rounded-xl border bg-white space-y-4">
      <div className="font-semibold">{title}</div>

      <EyeRow eyeLabel="OD" eyeKey="od" scrollerRef={scrollerODRef} />
      <EyeRow eyeLabel="OG" eyeKey="og" scrollerRef={scrollerOGRef} />
    </div>
  );
}
