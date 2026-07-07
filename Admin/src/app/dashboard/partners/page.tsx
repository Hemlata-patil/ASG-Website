"use client";

import React, { useState, useEffect } from "react";
import { Search, Handshake, Plus, Pencil, Trash2, ExternalLink, Undo, Redo } from "lucide-react";
import Modal, { FormField, Input, Select, Textarea, PrimaryBtn, DangerBtn, GhostBtn } from "../../components/Modal";
import { PageHeader } from "../../components/PageHeader";
import { useUndoRedoState } from "../../hooks/useUndoRedoState";

interface Partner {
  id: number;
  name: string;
  logo: string; // URL or Emoji
  website: string;
  category: string; // e.g. Tech Partner, Media Partner, Incubation Partner, Legal Partner
  description: string;
  status: "Active" | "Inactive";
  showOnWebsite: boolean;
}

const INITIAL: Partner[] = [
  { id: 1, name: "Amazon Web Services (AWS)", logo: "☁️", website: "https://aws.amazon.com", category: "Technology", description: "Providing cloud credits and technical support to cohort startups.", status: "Active", showOnWebsite: true },
  { id: 2, name: "Zoho India", logo: "💼", website: "https://zoho.com", category: "SaaS Products", description: "Offering free credits for Zoho Creator, Books, and Workspace suite.", status: "Active", showOnWebsite: true },
  { id: 3, name: "IIT Bombay SINE", logo: "🏫", website: "https://sineiitb.org", category: "Incubation", description: "Strategic academic partner supporting student innovation and patent registrations.", status: "Active", showOnWebsite: true },
  { id: 4, name: "Microsoft Founders Hub", logo: "🖥️", website: "https://foundershub.startups.microsoft.com", category: "Technology", description: "Azure credits, OpenAI API credits, and mentoring support.", status: "Active", showOnWebsite: false }
];

const empty: Omit<Partner, "id"> = {
  name: "",
  logo: "🤝",
  website: "",
  category: "Technology",
  description: "",
  status: "Active",
  showOnWebsite: true
};

export default function IndustryPartnersPage() {
  const [partners, setPartners, undo, redo, canUndo, canRedo] = useUndoRedoState<Partner[]>(INITIAL);

  useEffect(() => {
    try {
      const local = localStorage.getItem("asg_partners");
      if (local) {
        const saved = JSON.parse(local) as Partner[];
        const savedIds = new Set(saved.map((p) => p.id));
        const newEntries = INITIAL.filter((p) => !savedIds.has(p.id));
        setPartners([...saved, ...newEntries]);
      }
    } catch { /* ignore */ }
  }, [setPartners]);

  useEffect(() => {
    if (partners !== INITIAL) {
      localStorage.setItem("asg_partners", JSON.stringify(partners));
    }
  }, [partners]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Inactive">("All");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit" | "delete"; item: Partner | null }>({
    open: false, mode: "add", item: null
  });
  const [form, setForm] = useState<Omit<Partner, "id">>(empty);

  const filtered = partners.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggleStatus = (id: number) => {
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p)));
  };

  const openAdd = () => {
    setForm(empty);
    setModal({ open: true, mode: "add", item: null });
  };
  const openEdit = (item: Partner) => {
    const { id, ...rest } = item;
    setForm(rest);
    setModal({ open: true, mode: "edit", item });
  };
  const openDelete = (item: Partner) => setModal({ open: true, mode: "delete", item });
  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    if (!form.name || !form.website) return;
    if (modal.mode === "add") {
      setPartners((prev) => [...prev, { ...form, id: Date.now() }]);
    } else if (modal.item) {
      setPartners((prev) => prev.map((p) => (p.id === modal.item!.id ? { ...modal.item!, ...form } : p)));
    }
    close();
  };

  const remove = () => {
    if (modal.item) {
      setPartners((prev) => prev.filter((p) => p.id !== modal.item!.id));
    }
    close();
  };

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader
        icon={<Handshake size={20} style={{ color: "#FF6B00" }} />}
        title="Industry Partners"
        subtitle={`${partners.length} total partners · ${partners.filter((p) => p.status === "Active").length} active`}
        action={
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-150 rounded-xl p-1 shadow-2xs">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all border-none bg-transparent cursor-pointer"
                title="Undo Action"
              >
                <Undo size={14} />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all border-none bg-transparent cursor-pointer"
                title="Redo Action"
              >
                <Redo size={14} />
              </button>
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold border-none hover:opacity-90"
              style={{ background: "#FF6B00", cursor: "pointer", fontFamily: "'Satoshi', sans-serif", boxShadow: "0 2px 10px rgba(255,107,0,0.35)" }}>
              <Plus size={16} /> Add Partner
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
        <div className="flex flex-wrap items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #f5f5f5" }}>
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <Search size={15} style={{ color: "#bbb" }} />
            <input
              placeholder="Search partners…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: "14px", color: "#555", background: "none", flex: 1, fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div className="flex gap-1">
            {(["All", "Active", "Inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: "5px 14px",
                  borderRadius: "99px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  background: filterStatus === s ? "#FF6B00" : "#f4f4f5",
                  color: filterStatus === s ? "#fff" : "#555",
                  transition: "all 0.15s",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["Partner Logo & Name", "Category", "Website", "Description", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((partner) => (
                <tr key={partner.id} style={{ borderTop: "1px solid #f5f5f5" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "14px 16px" }}>
                    <div className="flex items-center gap-3">
                      <div style={{ fontSize: "20px" }}>{partner.logo}</div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d" }}>{partner.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "99px", background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>{partner.category}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px" }}>
                    <a href={partner.website} target="_blank" rel="noopener noreferrer" style={{ color: "#FF6B00", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      Link <ExternalLink size={12} />
                    </a>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555", maxWidth: "250px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{partner.description}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(partner.id)}
                        className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out align-middle border-none"
                        style={{
                          background: partner.status === "Active" ? "#10b981" : "#e5e7eb",
                          outline: "none"
                        }}
                        title={partner.status === "Active" ? "Disable" : "Enable"}
                      >
                        <span
                          className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out"
                          style={{
                            transform: partner.status === "Active" ? "translateX(16px)" : "translateX(0)"
                          }}
                        />
                      </button>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: partner.status === "Active" ? "#10b981" : "#888" }}>
                        {partner.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(partner)}
                        className="p-1.5 bg-orange-50 text-[#FF6B00] border-none cursor-pointer hover:bg-orange-100 rounded-lg"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => openDelete(partner)}
                        className="p-1.5 bg-red-50 text-red-500 border-none cursor-pointer hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "#bbb", fontSize: "14px" }}>No partners found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (modal.mode === "add" || modal.mode === "edit") && (
        <Modal isOpen={true} onClose={close} title={modal.mode === "add" ? "Add Partner" : "Edit Partner"} size="md">
          <div className="space-y-4">
            <FormField label="Partner Name *">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. AWS" />
            </FormField>
            <FormField label="Website Link *">
              <Input type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://..." />
            </FormField>
            <div className="grid grid-cols-2 gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Logo (Emoji / Symbol)">
                <Input value={form.logo} onChange={(e) => set("logo", e.target.value)} placeholder="🤝" />
              </FormField>
              <FormField label="Category">
                <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option>Technology</option>
                  <option>SaaS Products</option>
                  <option>Incubation</option>
                  <option>Legal</option>
                  <option>Marketing</option>
                  <option>Fintech</option>
                </Select>
              </FormField>
            </div>
            <FormField label="Description">
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the partnership benefits…" rows={3} />
            </FormField>
            <FormField label="Status">
                <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
                  <option>Active</option>
                  <option>Inactive</option>
                </Select>
              </FormField>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <GhostBtn onClick={close}>Cancel</GhostBtn>
              <PrimaryBtn onClick={save}>{modal.mode === "add" ? "Add Partner" : "Save Changes"}</PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}

      <Modal isOpen={modal.open && modal.mode === "delete"} onClose={close} title="Remove Partner" size="sm">
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
          Remove partner <strong>"{modal.item?.name}"</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <GhostBtn onClick={close}>Cancel</GhostBtn>
          <DangerBtn onClick={remove}>Remove</DangerBtn>
        </div>
      </Modal>
    </div>
  );
}
