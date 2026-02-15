import { useState } from "react";

const SECTIONS = [
  {
    id: "company",
    title: "Ihr Unternehmen",
    icon: "🏢",
    fields: [
      { key: "companyName", label: "Firmenname", type: "text", placeholder: "z.B. SolarTech GmbH" },
      { key: "industry", label: "Branche", type: "text", placeholder: "z.B. Immobilien, Versicherung, SaaS, Recruiting..." },
      { key: "whatYouSell", label: "Was bieten Sie an? (ein Satz)", type: "text", placeholder: "z.B. Wir vermitteln Fachkräfte an Unternehmen im DACH-Raum" },
      { key: "leadSource", label: "Woher kommen Ihre Leads?", type: "multiselect", options: ["Website-Formular", "Landing Page", "Social Media Ads", "Google Ads", "Messe / Event", "Empfehlung", "Gekaufte Listen", "CRM-Bestand", "Sonstige"] },
      { key: "leadSourceOther", label: "Falls Sonstige, woher?", type: "text", placeholder: "z.B. Partnerempfehlungen, Webinare...", conditional: (data) => (data.leadSource || []).includes("Sonstige") },
    ],
  },
  {
    id: "agent",
    title: "Agent-Einrichtung",
    icon: "🎙️",
    fields: [
      { key: "agentName", label: "Name des Agenten", type: "text", placeholder: "z.B. Lisa, Max, Sophie..." },
      { key: "agentLanguage", label: "Sprache(n) des Agenten", type: "text", placeholder: "z.B. Deutsch, Englisch, beides" },
      { key: "tone", label: "Tonalität", type: "multiselect", options: ["Professionell", "Freundlich & Locker", "Selbstbewusst & Direkt", "Beratend", "Warm & Persönlich"] },
      { key: "personalityNotes", label: "Besondere Hinweise zur Persönlichkeit (optional)", type: "textarea", placeholder: "z.B. Soll geduldig sein, nicht aufdringlich wirken, einfache Sprache verwenden..." },
    ],
  },
  {
    id: "qualification",
    title: "Qualifizierung",
    icon: "🎯",
    fields: [
      { key: "callGoal", label: "Was ist das Hauptziel des Anrufs?", type: "multiselect", options: ["Lead qualifizieren", "Termin für Vertrieb buchen", "Interesse bestätigen", "Bedarf ermitteln", "An Vertriebsmitarbeiter weiterleiten", "Angebot nachfassen"] },
      { key: "qualifyingQuestions", label: "Welche Fragen soll der Agent stellen, um den Lead zu qualifizieren?", type: "textarea", placeholder: "z.B.\n- Haben Sie aktuell Bedarf an [Produkt/Dienstleistung]?\n- Wie viele Mitarbeiter hat Ihr Unternehmen?\n- Wer entscheidet über den Einkauf?\n- Wie hoch ist Ihr Budget?\n- Bis wann möchten Sie eine Lösung?" },
      { key: "qualifiedCriteria", label: "Wann gilt ein Lead als qualifiziert?", type: "textarea", placeholder: "z.B.\n- Hat konkreten Bedarf in den nächsten 3 Monaten\n- Entscheider oder direkter Kontakt zum Entscheider\n- Budget ab 5.000€\n- Unternehmen mit 10+ Mitarbeitern" },
      { key: "disqualifiedCriteria", label: "Wann ist ein Lead NICHT qualifiziert?", type: "textarea", placeholder: "z.B.\n- Kein Budget vorhanden\n- Bereits bei einem Mitbewerber unter Vertrag\n- Falsche Branche / Zielgruppe\n- Kein Entscheidungsbefugnis" },
      { key: "leadScoring", label: "Soll der Agent den Lead bewerten (z.B. heiß/warm/kalt)?", type: "select", options: ["Ja, in Kategorien (heiß/warm/kalt)", "Ja, mit Punktesystem", "Nein, nur qualifiziert/nicht qualifiziert"] },
    ],
  },
  {
    id: "script",
    title: "Gesprächsleitfaden",
    icon: "📞",
    fields: [
      { key: "intro", label: "1. Begrüßung — Wie soll sich der Agent vorstellen?", type: "textarea", placeholder: "z.B. Guten Tag, hier ist [Agent] von [Firma]. Sie haben sich kürzlich für [Angebot/Thema] interessiert. Haben Sie kurz Zeit?" },
      { key: "context", label: "2. Kontext — Wie soll der Agent auf den Lead eingehen?", type: "textarea", placeholder: "z.B. Sie haben sich am [Datum] auf unserer Website für [Angebot] eingetragen. Ich möchte kurz prüfen, ob wir Ihnen weiterhelfen können." },
      { key: "discovery", label: "3. Bedarfsermittlung — Was soll der Agent herausfinden?", type: "textarea", placeholder: "z.B. Was ist Ihre aktuelle Herausforderung bei [Thema]? Welche Lösung nutzen Sie derzeit? Was wäre für Sie das ideale Ergebnis?" },
      { key: "nextStep", label: "4. Nächster Schritt — Was passiert mit qualifizierten Leads?", type: "textarea", placeholder: "z.B. Perfekt, ich würde Sie gerne mit unserem Experten verbinden. Passt Ihnen Dienstag oder Mittwoch für ein 15-Minuten-Gespräch?" },
      { key: "notQualified", label: "5. Nicht qualifiziert — Wie soll der Agent reagieren?", type: "textarea", placeholder: "z.B. Vielen Dank für Ihre Zeit. Ich merke mir Ihre Angaben und wir melden uns, sobald wir etwas Passendes haben." },
      { key: "closing", label: "6. Abschluss — Wie soll der Agent das Gespräch beenden?", type: "textarea", placeholder: "z.B. Vielen Dank für Ihre Zeit! Sie erhalten eine Bestätigung per [WhatsApp/E-Mail]. Schönen Tag noch!" },
      { key: "scriptNotes", label: "Zusätzliche Hinweise zum Ablauf (optional)", type: "textarea", placeholder: "z.B. Lead immer mit Namen ansprechen, max. 3 Minuten pro Anruf, bei Nichterreichung 2x erneut versuchen..." },
    ],
  },
  {
    id: "objections",
    title: "Einwände & Grenzen",
    icon: "🛡️",
    fields: [
      { key: "commonObjections", label: "Häufige Einwände bei der Qualifizierung (alle relevanten auswählen)", type: "multiselect", options: ["Habe mich gar nicht eingetragen", "Kein Interesse mehr", "Gerade keine Zeit", "Muss ich intern abstimmen", "Haben bereits eine Lösung", "Zu teuer / Kein Budget", "Schicken Sie mir Unterlagen"] },
      { key: "objectionNotes", label: "Wie soll der Agent damit umgehen? (optional)", type: "textarea", placeholder: "z.B.\n'Kein Interesse mehr' → Kurz nachfragen was sich geändert hat, ggf. Info-Material anbieten\n'Schicken Sie mir Unterlagen' → Zustimmen, E-Mail bestätigen, Follow-up in 3 Tagen" },
      { key: "neverSay", label: "Was darf der Agent NIEMALS sagen oder tun?", type: "textarea", placeholder: "z.B. Nie Preise nennen, keine verbindlichen Zusagen machen, nicht drängen..." },
      { key: "maxAttempts", label: "Wie oft soll der Agent versuchen, einen Lead zu erreichen?", type: "select", options: ["1x — nur ein Versuch", "2x — ein Rückrufversuch", "3x — über verschiedene Tage", "Unbegrenzt bis erreicht"] },
    ],
  },
  {
    id: "tools",
    title: "Tools & Kanäle",
    icon: "⚙️",
    fields: [
      { key: "hasCRM", label: "Nutzen Sie ein CRM?", type: "select", options: ["Ja", "Nein"] },
      { key: "crmName", label: "Welches CRM?", type: "select", options: ["HubSpot", "Salesforce", "Pipedrive", "Close", "Zoho CRM", "Monday Sales", "GoHighLevel", "Anderes"], conditional: (data) => data.hasCRM === "Ja" },
      { key: "crmNameOther", label: "Falls Anderes, welches CRM?", type: "text", placeholder: "z.B. Freshsales, eigenes System...", conditional: (data) => data.hasCRM === "Ja" && data.crmName === "Anderes" },
      { key: "crmUpdate", label: "Soll der Agent den Lead-Status im CRM aktualisieren?", type: "select", options: ["Ja", "Nein", "Weiß noch nicht"], conditional: (data) => data.hasCRM === "Ja" },
      { key: "hasCalendar", label: "Nutzen Sie ein Kalender-/Buchungstool?", type: "select", options: ["Ja", "Nein"] },
      { key: "calendarName", label: "Welches Tool?", type: "select", options: ["Calendly", "Cal.com", "Google Calendar", "HubSpot Meetings", "Acuity", "Anderes"], conditional: (data) => data.hasCalendar === "Ja" },
      { key: "calendarNameOther", label: "Falls Anderes, welches?", type: "text", placeholder: "z.B. SavvyCal, eigener Link...", conditional: (data) => data.hasCalendar === "Ja" && data.calendarName === "Anderes" },
      { key: "calendarLink", label: "Buchungslink (falls vorhanden)", type: "text", placeholder: "z.B. https://calendly.com/ihr-name", conditional: (data) => data.hasCalendar === "Ja" },
      { key: "sendConfirmation", label: "Soll der Agent nach der Buchung eine Bestätigung senden?", type: "select", options: ["Ja", "Nein"] },
      { key: "confirmationMethod", label: "Wie sollen Bestätigungen gesendet werden?", type: "multiselect", options: ["WhatsApp", "SMS", "E-Mail"], conditional: (data) => data.sendConfirmation === "Ja" },
      { key: "notifyTeam", label: "Soll das Vertriebsteam benachrichtigt werden, wenn ein Lead qualifiziert ist?", type: "select", options: ["Ja, per E-Mail", "Ja, per Slack/Teams", "Ja, im CRM", "Nein"] },
      { key: "additionalNotes", label: "Gibt es sonst noch etwas, das wir wissen sollten?", type: "textarea", placeholder: "Besondere Abläufe, Integrationen oder Anforderungen..." },
    ],
  },
];

const MultiSelect = ({ options, selected = [], onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    {options.map((opt) => {
      const isSelected = selected.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(isSelected ? selected.filter((s) => s !== opt) : [...selected, opt])}
          style={{
            padding: "8px 16px",
            borderRadius: "100px",
            border: isSelected ? "2px solid #7c3aed" : "2px solid #ddd6e9",
            background: isSelected ? "#f3f0ff" : "#f9f8fc",
            color: isSelected ? "#5b21b6" : "#4b5563",
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: isSelected ? 600 : 400,
            transition: "all 0.2s ease",
          }}
        >
          {isSelected && "✓ "}{opt}
        </button>
      );
    })}
  </div>
);

export default function LeadQualificationOnboarding() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { _formType: "Lead-Qualifizierung Onboarding" };
      SECTIONS.forEach((sec) => {
        sec.fields
          .filter((f) => !f.conditional || f.conditional(formData))
          .forEach((f) => {
            const val = formData[f.key];
            if (val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "")) {
              payload[f.label] = Array.isArray(val) ? val.join(", ") : val;
            }
          });
      });
      await fetch("https://formspree.io/f/mnjbqvey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      alert("Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.");
    }
    setSubmitting(false);
  };

  const goTo = (idx) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSection(idx);
      setAnimating(false);
    }, 200);
  };

  const section = SECTIONS[currentSection];
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  const allFields = SECTIONS.flatMap((s) =>
    s.fields.filter((f) => !f.conditional || f.conditional(formData))
  );
  const filledFields = allFields.filter((f) => {
    const val = formData[f.key];
    return val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "");
  }).length;

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #f5f3ff 0%, #ede9fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "24px",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "52px 40px",
          maxWidth: "580px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(124,58,237,0.08)",
        }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", color: "#111827", marginBottom: "10px" }}>
            Onboarding abgeschlossen
          </h2>
          <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.6, marginBottom: "28px" }}>
            {filledFields} von {allFields.length} Feldern ausgefüllt. Ihr Qualifizierungs-Agent wird auf dieser Basis erstellt.
          </p>
          <div style={{
            background: "#faf8ff",
            borderRadius: "14px",
            padding: "24px",
            textAlign: "left",
            maxHeight: "400px",
            overflowY: "auto",
          }}>
            {SECTIONS.map((sec) => (
              <div key={sec.id} style={{ marginBottom: "18px" }}>
                <h4 style={{ color: "#7c3aed", fontSize: "13px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {sec.icon} {sec.title}
                </h4>
                {sec.fields
                  .filter((f) => !f.conditional || f.conditional(formData))
                  .filter((f) => {
                    const val = formData[f.key];
                    return val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "");
                  })
                  .map((f) => (
                    <div key={f.key} style={{ marginBottom: "5px", fontSize: "13px" }}>
                      <span style={{ color: "#9ca3af", fontWeight: 500 }}>{f.label}:</span>{" "}
                      <span style={{ color: "#1f2937" }}>
                        {Array.isArray(formData[f.key]) ? formData[f.key].join(", ") : formData[f.key]}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSubmitted(false); setCurrentSection(0); }}
            style={{
              marginTop: "20px",
              padding: "12px 28px",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← Antworten bearbeiten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(165deg, #f5f3ff 0%, #ede9fe 100%)",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />

      <div style={{ padding: "28px 32px 16px" }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "24px",
          color: "#111827",
          margin: 0,
          fontWeight: 700,
        }}>
          🎯 Lead-Qualifizierung Voice Agent — Onboarding
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: "6px 0 0" }}>
          Beantworten Sie diese Fragen, damit wir Ihren individuellen Qualifizierungs-Agent erstellen können
        </p>
      </div>

      <div style={{ padding: "0 32px", marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
            Schritt {currentSection + 1} von {SECTIONS.length}
          </span>
          <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
            {filledFields} / {allFields.length} ausgefüllt
          </span>
        </div>
        <div style={{ height: "4px", background: "#ddd6e9", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
            borderRadius: "4px",
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px", padding: "10px 32px", overflowX: "auto" }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              border: "none",
              background: i === currentSection ? "#7c3aed" : "#fff",
              color: i === currentSection ? "#fff" : "#4b5563",
              fontSize: "13px",
              fontWeight: i === currentSection ? 600 : 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: i === currentSection ? "0 4px 12px rgba(124,58,237,0.2)" : "0 1px 3px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease",
            }}
          >
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      <div style={{
        flex: 1,
        padding: "16px 32px 32px",
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(6px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px 28px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          maxWidth: "640px",
        }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "20px",
            color: "#111827",
            marginTop: 0,
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{ fontSize: "24px" }}>{section.icon}</span>
            {section.title}
          </h2>

          {section.fields
            .filter((f) => !f.conditional || f.conditional(formData))
            .map((field) => (
              <div key={field.key} style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1f2937",
                  marginBottom: "7px",
                }}>
                  {field.label}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: "8px",
                      border: "2px solid #e5e7eb", fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif", background: "#fafbfc",
                      outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: "8px",
                      border: "2px solid #e5e7eb", fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif", background: "#fafbfc",
                      outline: "none", resize: "vertical", boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                )}

                {field.type === "select" && (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: "8px",
                      border: "2px solid #e5e7eb", fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif", background: "#fafbfc",
                      outline: "none", cursor: "pointer", boxSizing: "border-box",
                    }}
                  >
                    <option value="">Auswählen...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === "multiselect" && (
                  <MultiSelect
                    options={field.options}
                    selected={formData[field.key] || []}
                    onChange={(val) => updateField(field.key, val)}
                  />
                )}
              </div>
            ))}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px", gap: "12px" }}>
            <button
              onClick={() => goTo(currentSection - 1)}
              disabled={currentSection === 0}
              style={{
                padding: "12px 24px", borderRadius: "10px",
                border: "2px solid #e5e7eb", background: "#fff",
                color: currentSection === 0 ? "#ccc" : "#374151",
                fontSize: "14px", fontWeight: 600,
                cursor: currentSection === 0 ? "default" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                opacity: currentSection === 0 ? 0.4 : 1,
              }}
            >
              ← Zurück
            </button>

            {currentSection < SECTIONS.length - 1 ? (
              <button
                onClick={() => goTo(currentSection + 1)}
                style={{
                  padding: "12px 28px", borderRadius: "10px", border: "none",
                  background: "#7c3aed", color: "#fff", fontSize: "14px",
                  fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 12px rgba(124,58,237,0.2)",
                }}
              >
                Weiter →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: "12px 32px", borderRadius: "10px", border: "none",
                  background: submitting ? "#b4a0e6" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  color: "#fff", fontSize: "14px", fontWeight: 700,
                  cursor: submitting ? "wait" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
                }}
              >
                {submitting ? "Wird gesendet..." : "✓ Absenden"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
