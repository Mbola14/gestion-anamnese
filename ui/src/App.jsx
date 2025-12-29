import { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Chargement...");

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ZOHO) {
          setStatus("ZOHO SDK non chargé");
          return;
        }
        await window.ZOHO.embeddedApp.init();
        setStatus("✅ Zoho SDK initialisé + React OK");
      } catch (e) {
        console.error(e);
        setStatus("❌ Erreur init Zoho (voir console)");
      }
    };

    init();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Widget React</h2>
      <p>{status}</p>
    </div>
  );
}
