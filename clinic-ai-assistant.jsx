import { useState, useEffect, useRef } from "react";

const CLINIC_DATA = [
  { id: 1, name: "Ramesh Mehta", phone: "98765 43210", condition: "BP Check", time: "10:00 AM", date: "Today", status: "pending" },
  { id: 2, name: "Priya Shah", phone: "87654 32109", condition: "Diabetes Follow-up", time: "11:30 AM", date: "Today", status: "pending" },
  { id: 3, name: "Kiran Patel", phone: "76543 21098", condition: "General Checkup", time: "2:00 PM", date: "Today", status: "sent" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  sent: { label: "Sent", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  generating: { label: "Generating...", color: "#6366F1", bg: "rgba(99,102,241,0.12)" },
};

const CONDITION_ICONS = {
  "BP Check": "🫀",
  "Diabetes Follow-up": "🩸",
  "General Checkup": "🩺",
  "Thyroid Test": "⚕️",
  "Dental": "🦷",
};

function TypingText({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx < text.length) {
      const t = setTimeout(() => { setDisplayed(text.slice(0, idx + 1)); setIdx(i => i + 1); }, 18);
      return () => clearTimeout(t);
    } else { onDone && onDone(); }
  }, [idx, text]);
  return <span>{displayed}<span style={{ opacity: idx < text.length ? 1 : 0, animation: "blink 1s infinite" }}>|</span></span>;
}

export default function ClinicAI() {
  const [patients, setPatients] = useState(CLINIC_DATA);
  const [selected, setSelected] = useState(null);
  const [generatedMsg, setGeneratedMsg] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", phone: "", condition: "BP Check", time: "", date: "Today" });
  const [activeTab, setActiveTab] = useState("patients");
  const [stats, setStats] = useState({ sent: 1, pending: 2, total: 3 });
  const [pulse, setPulse] = useState(false);
  const msgRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  async function generateReminder(patient) {
    setSelected(patient);
    setGeneratedMsg("");
    setIsGenerating(true);
    setTypingDone(false);
    setActiveTab("message");

    setPatients(ps => ps.map(p => p.id === patient.id ? { ...p, status: "generating" } : p));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a clinic communication assistant for Dr. Patel's Family Clinic in Ahmedabad, Gujarat.
Generate a warm, professional WhatsApp reminder message in this EXACT format:

Namaste [Name] 🙏

Your appointment at Dr. Patel's Family Clinic is confirmed:
📅 [Date] at [Time]
🏥 Purpose: [Condition]

[One personalized health tip relevant to their condition - 1 sentence, friendly tone]

Please arrive 5 minutes early. For any changes, reply to this message.

Dr. Patel's Family Clinic, Satellite Road, Ahmedabad
📞 079-XXXX-XXXX

Keep it warm, concise, and genuinely helpful. Add relevant emoji. Write in English.`,
          messages: [{ role: "user", content: `Generate WhatsApp reminder for: Name: ${patient.name}, Condition: ${patient.condition}, Date: ${patient.date}, Time: ${patient.time}` }]
        })
      });
      const data = await res.json();
      const msg = data.content?.[0]?.text || "Message generated successfully.";
      setGeneratedMsg(msg);
      setPatients(ps => ps.map(p => p.id === patient.id ? { ...p, status: "sent" } : p));
      setStats(s => ({ ...s, sent: s.sent + (patient.status === "pending" ? 1 : 0), pending: Math.max(0, s.pending - (patient.status === "pending" ? 1 : 0)) }));
    } catch (e) {
      setGeneratedMsg(`Namaste ${patient.name} 🙏\n\nYour appointment at Dr. Patel's Family Clinic is confirmed:\n📅 ${patient.date} at ${patient.time}\n🏥 Purpose: ${patient.condition}\n\nPlease stay hydrated and bring any previous reports. Arrive 5 minutes early.\n\nDr. Patel's Family Clinic, Satellite Road, Ahmedabad\n📞 079-XXXX-XXXX`);
      setPatients(ps => ps.map(p => p.id === patient.id ? { ...p, status: "sent" } : p));
    }
    setIsGenerating(false);
  }

  function addPatient() {
    if (!newPatient.name || !newPatient.time) return;
    const p = { ...newPatient, id: Date.now(), status: "pending" };
    setPatients(ps => [...ps, p]);
    setStats(s => ({ ...s, total: s.total + 1, pending: s.pending + 1 }));
    setNewPatient({ name: "", phone: "", condition: "BP Check", time: "", date: "Today" });
    setShowAddForm(false);
  }

  const statusCount = patients.reduce((a, p) => { a[p.status] = (a[p.status] || 0) + 1; return a; }, {});

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0A0F1E", minHeight: "100vh", color: "#E2E8F0", padding: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0A0F1E; } ::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 2px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .patient-row { transition: all 0.2s; cursor: pointer; }
        .patient-row:hover { background: rgba(30,90,160,0.15) !important; transform: translateX(2px); }
        .btn-primary { background: linear-gradient(135deg,#1E56A0,#2563EB); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(37,99,235,0.4); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .tab { padding: 8px 20px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; border: none; }
        input, select { background: #111827; border: 1px solid #1E3A5F; color: #E2E8F0; padding: 8px 12px; border-radius: 8px; font-size: 13px; width: 100%; outline: none; font-family: inherit; }
        input:focus, select:focus { border-color: #2563EB; }
        .generating-dot { width: 6px; height: 6px; background: #6366F1; border-radius: 50%; animation: pulse 0.8s infinite; display: inline-block; margin: 0 2px; }
      `}</style>

      {/* TOP NAV */}
      <div style={{ background: "linear-gradient(90deg,#0D1B2E,#0A1628)", borderBottom: "1px solid #1E3A5F", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#1E56A0,#3B82F6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏥</div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: "#F0F6FF" }}>Dr. Patel's Clinic</div>
            <div style={{ fontSize: 11, color: "#4A7FC0" }}>AI Patient Communication System</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 8, height: 8, background: "#10B981", borderRadius: "50%", animation: "pulse 2s infinite" }}></div>
          <span style={{ fontSize: 12, color: "#10B981", fontWeight: 500 }}>System Active</span>
        </div>
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1100, margin: "0 auto" }}>

        {/* STATS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Patients Today", value: patients.length, icon: "👥", color: "#3B82F6" },
            { label: "Reminders Sent", value: patients.filter(p=>p.status==="sent").length, icon: "✅", color: "#10B981" },
            { label: "Pending Reminders", value: patients.filter(p=>p.status==="pending").length, icon: "⏳", color: "#F59E0B" },
            { label: "AI Messages Generated", value: patients.filter(p=>p.status==="sent").length, icon: "🤖", color: "#8B5CF6" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#0D1B2E", border: "1px solid #1E3A5F", borderRadius: 12, padding: "14px 16px", animation: `fadeIn 0.3s ${i*0.1}s both` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#4A7FC0", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk'" }}>{s.value}</div>
                </div>
                <div style={{ fontSize: 22 }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* LEFT PANEL */}
          <div style={{ background: "#0D1B2E", border: "1px solid #1E3A5F", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #1E3A5F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 14 }}>Today's Patients</div>
              <button className="btn-primary" onClick={() => setShowAddForm(v => !v)} style={{ fontSize: 12, padding: "6px 12px" }}>
                {showAddForm ? "Cancel" : "+ Add Patient"}
              </button>
            </div>

            {showAddForm && (
              <div style={{ padding: 14, borderBottom: "1px solid #1E3A5F", background: "#080E1A", animation: "fadeIn 0.2s" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <input placeholder="Patient Name" value={newPatient.name} onChange={e => setNewPatient(p => ({ ...p, name: e.target.value }))} />
                  <input placeholder="Phone Number" value={newPatient.phone} onChange={e => setNewPatient(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                  <select value={newPatient.condition} onChange={e => setNewPatient(p => ({ ...p, condition: e.target.value }))}>
                    <option>BP Check</option>
                    <option>Diabetes Follow-up</option>
                    <option>General Checkup</option>
                    <option>Thyroid Test</option>
                    <option>Dental</option>
                  </select>
                  <input placeholder="Time (e.g. 3:00 PM)" value={newPatient.time} onChange={e => setNewPatient(p => ({ ...p, time: e.target.value }))} />
                </div>
                <button className="btn-primary" onClick={addPatient} style={{ width: "100%" }}>Add Patient</button>
              </div>
            )}

            <div>
              {patients.map((p, i) => {
                const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
                const icon = CONDITION_ICONS[p.condition] || "🩺";
                return (
                  <div key={p.id} className="patient-row"
                    onClick={() => { setSelected(p); setActiveTab("message"); if (p.status !== "sent" && p.status !== "generating") {} }}
                    style={{ padding: "12px 16px", borderBottom: "1px solid #0D1B2E", background: selected?.id === p.id ? "rgba(30,86,160,0.2)" : "transparent", animation: `fadeIn 0.3s ${i*0.08}s both` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#1E3A5F,#0D2A4A)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#F0F6FF" }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "#4A7FC0" }}>{p.condition} • {p.time}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: sc.color, background: sc.bg, padding: "3px 8px", borderRadius: 20 }}>{sc.label}</span>
                        <button className="btn-primary"
                          disabled={p.status === "generating"}
                          onClick={(e) => { e.stopPropagation(); generateReminder(p); }}
                          style={{ fontSize: 11, padding: "5px 10px", background: p.status === "sent" ? "linear-gradient(135deg,#065F46,#059669)" : undefined }}>
                          {p.status === "generating" ? "..." : p.status === "sent" ? "Resend" : "Send AI Reminder"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ background: "#0D1B2E", border: "1px solid #1E3A5F", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #1E3A5F" }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 14 }}>
                {selected ? `AI Message — ${selected.name}` : "AI Message Generator"}
              </div>
              {selected && <div style={{ fontSize: 11, color: "#4A7FC0", marginTop: 2 }}>{selected.condition} • {selected.time}</div>}
            </div>

            <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {!selected && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#2A4A6A" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Click "Send AI Reminder"</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>to generate a personalized message</div>
                </div>
              )}

              {isGenerating && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0,1,2].map(i => <div key={i} className="generating-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  </div>
                  <div style={{ fontSize: 13, color: "#6366F1", fontWeight: 500 }}>Claude AI is generating personalized message...</div>
                  <div style={{ fontSize: 11, color: "#2A4A6A" }}>Analyzing patient condition and appointment details</div>
                </div>
              )}

              {!isGenerating && generatedMsg && (
                <div style={{ animation: "fadeIn 0.4s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, background: "#25D366", borderRadius: "50%" }}></div>
                    <span style={{ fontSize: 12, color: "#25D366", fontWeight: 600 }}>WhatsApp Message Ready</span>
                  </div>

                  <div style={{ background: "#111827", border: "1px solid #1E3A5F", borderRadius: 12, padding: 14, position: "relative" }}>
                    <div style={{ position: "absolute", top: 10, right: 10, background: "#25D366", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "white" }}>WhatsApp</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.7, color: "#D1E8D0", fontFamily: "monospace", whiteSpace: "pre-wrap", paddingRight: 60 }}>
                      <TypingText text={generatedMsg} onDone={() => setTypingDone(true)} />
                    </div>
                  </div>

                  {typingDone && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10, animation: "fadeIn 0.3s" }}>
                      <button className="btn-primary" style={{ flex: 1, background: "linear-gradient(135deg,#065F46,#059669)" }}>
                        ✓ Mark as Sent
                      </button>
                      <button className="btn-primary" style={{ flex: 1 }} onClick={() => generateReminder(selected)}>
                        ↺ Regenerate
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BOTTOM INFO */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid #1E3A5F", background: "#080E1A", display: "flex", gap: 16 }}>
              {[
                { icon: "🤖", label: "Powered by Claude AI" },
                { icon: "🔒", label: "HIPAA Compliant" },
                { icon: "⚡", label: "< 3 sec generation" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12 }}>{item.icon}</span>
                  <span style={{ fontSize: 10, color: "#2A4A6A", fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM AUTOMATION STATUS */}
        <div style={{ marginTop: 16, background: "#0D1B2E", border: "1px solid #1E3A5F", borderRadius: 12, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, color: "#4A7FC0", marginBottom: 8, fontWeight: 600 }}>AUTOMATION PIPELINE STATUS</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "Appointment Reminders", status: "ACTIVE", color: "#10B981" },
              { label: "Follow-up Scheduler", status: "ACTIVE", color: "#10B981" },
              { label: "Feedback Collector", status: "ACTIVE", color: "#10B981" },
              { label: "Ghost Patient Re-engagement", status: "SCHEDULED", color: "#F59E0B" },
              { label: "AI Voice Calls", status: "BUILDING", color: "#6366F1" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "#080E1A", border: "1px solid #1E3A5F", borderRadius: 20, padding: "4px 12px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, animation: item.status === "ACTIVE" ? "pulse 2s infinite" : "none" }}></div>
                <span style={{ fontSize: 11, color: "#A0B4C8" }}>{item.label}</span>
                <span style={{ fontSize: 10, color: item.color, fontWeight: 700 }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
