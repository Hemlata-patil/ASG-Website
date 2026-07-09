"use client";

import React, { useState } from "react";
import { Settings, Bell, Shield, Globe, Save, Check } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [general, setGeneral] = useState({
    siteName: "ASG Admin Panel",
    siteEmail: "admin@asg.io",
    supportEmail: "support@asg.io",
    tagline: "Empowering Student Innovation Across India",
    timezone: "Asia/Kolkata",
    language: "en",
  });
  const [notifications, setNotifications] = useState({
    newMember: true,
    newEvent: true,
    newBlog: false,
    weeklyReport: true,
    systemAlerts: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "60",
    loginAlerts: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1.5px solid #ebebeb",
    background: "#f8f8f8",
    fontSize: "14px",
    color: "#0d0d0d",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          icon={<Settings size={20} style={{ color: "#FF6B00" }} />}
          title="Settings"
          subtitle="Manage platform configuration"
        />
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all border-none hover:opacity-90"
          style={{
            background: saved ? "#10b981" : "#FF6B00",
            cursor: "pointer",
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "14px",
            boxShadow: saved ? "0 2px 10px rgba(16,185,129,0.35)" : "0 2px 10px rgba(255,107,0,0.35)",
            transition: "all 0.3s",
          }}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6 text-gray-800">
        <Section icon={<Globe size={18} style={{ color: "#FF6B00" }} />} title="General Settings">
          <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Platform Name">
              <input style={inputStyle} value={general.siteName}
                onChange={(e) => setGeneral((g) => ({ ...g, siteName: e.target.value }))}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#FF6B00"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.1)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.background = "#f8f8f8"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </Field>
            <Field label="Admin Email">
              <input style={inputStyle} type="email" value={general.siteEmail}
                onChange={(e) => setGeneral((g) => ({ ...g, siteEmail: e.target.value }))}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#FF6B00"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.1)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.background = "#f8f8f8"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </Field>
            <Field label="Support Email">
              <input style={inputStyle} type="email" value={general.supportEmail}
                onChange={(e) => setGeneral((g) => ({ ...g, supportEmail: e.target.value }))}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#FF6B00"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.1)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.background = "#f8f8f8"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </Field>
            <Field label="Timezone">
              <select style={{ ...inputStyle, cursor: "pointer" }} value={general.timezone}
                onChange={(e) => setGeneral((g) => ({ ...g, timezone: e.target.value }))}>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Platform Tagline">
                <input style={inputStyle} value={general.tagline}
                  onChange={(e) => setGeneral((g) => ({ ...g, tagline: e.target.value }))}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#FF6B00"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.1)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.background = "#f8f8f8"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </Field>
            </div>
          </div>
        </Section>

        <Section icon={<Bell size={18} style={{ color: "#FF6B00" }} />} title="Notification Preferences">
          <div className="space-y-4">
            {([
              { key: "newMember", label: "New member joins", desc: "Get notified when a new member registers" },
              { key: "newEvent", label: "New event created", desc: "Get notified when an event is added" },
              { key: "newBlog", label: "New blog post", desc: "Get notified when a blog is published" },
              { key: "weeklyReport", label: "Weekly summary report", desc: "Receive weekly analytics digest every Monday" },
              { key: "systemAlerts", label: "System alerts", desc: "Critical system and security notifications" },
            ] as const).map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #f5f5f5" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#0d0d0d" }}>{label}</div>
                  <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>{desc}</div>
                </div>
                <Toggle
                  checked={notifications[key]}
                  onChange={(v) => setNotifications((n) => ({ ...n, [key]: v }))}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<Shield size={18} style={{ color: "#FF6B00" }} />} title="Security">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #f5f5f5" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "#0d0d0d" }}>Two-Factor Authentication</div>
                <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>Add an extra layer of security to admin accounts</div>
              </div>
              <Toggle checked={security.twoFactor} onChange={(v) => setSecurity((s) => ({ ...s, twoFactor: v }))} />
            </div>
            <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #f5f5f5" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "#0d0d0d" }}>Login alerts</div>
                <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>Email notification on new admin logins</div>
              </div>
              <Toggle checked={security.loginAlerts} onChange={(v) => setSecurity((s) => ({ ...s, loginAlerts: v }))} />
            </div>
            <div className="py-3">
              <div style={{ fontSize: "14px", fontWeight: 500, color: "#0d0d0d", marginBottom: "8px" }}>Session Timeout (minutes)</div>
              <select style={{ ...inputStyle, maxWidth: "200px", cursor: "pointer" }}
                value={security.sessionTimeout}
                onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))}>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="120">2 hours</option>
                <option value="480">8 hours</option>
              </select>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div className="flex items-center gap-3 mb-5" style={{ borderBottom: "1px solid #f5f5f5", paddingBottom: "16px" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,107,0,0.1)" }}>{icon}</div>
        <h2 style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: "16px", color: "#0d0d0d" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#3a3a3a", marginBottom: "6px" }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="border-none"
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "99px",
        background: checked ? "#FF6B00" : "#e0e0e0",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: checked ? "22px" : "2px",
          width: "20px",
          height: "20px",
          background: "#fff",
          borderRadius: "99px",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}
