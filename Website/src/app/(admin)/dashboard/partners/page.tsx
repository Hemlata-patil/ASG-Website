"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Handshake, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import Modal, { FormField, Input, Select, Textarea, PrimaryBtn, DangerBtn, GhostBtn } from "@/components/admin/Modal";
import { PageHeader } from "@/components/admin/PageHeader";
import { createPartnerAction, deletePartnerAction, getPartnersAction, togglePartnerStatusAction, updatePartnerAction } from "@/app/actions/partners";
import ImageUpload from "@/components/shared/ImageUpload";
import { useActionStack } from "@/hooks/admin/useActionStack";
import { Undo2, Redo2 } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  category: string;
  description: string;
  status: "Active" | "Inactive";
}

interface PartnerForm {
  name: string;
  logo: string;
  website: string;
  category: string;
  description: string;
  status: "Active" | "Inactive";
}

const empty: PartnerForm = {
  name: "",
  logo: "",
  website: "",
  category: "Technology",
  description: "",
  status: "Active",
};

export default function IndustryPartnersPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Inactive">("All");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit" | "delete"; item: Partner | null }>({
    open: false, mode: "add", item: null,
  });
  const [form, setForm] = useState<PartnerForm>(empty);
  const { pushAction, undo, redo, canUndo, canRedo, isProcessing } = useActionStack();

  const loadPartners = async () => {
    setLoading(true);
    try {
      const data = await getPartnersAction();
      setPartners(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          logo: item.logo || "",
          website: item.website || item.websiteUrl || "",
          category: item.category || "Technology",
          description: item.description || "",
          status: item.status,
        }))
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load partners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPartners();
  }, []);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || p.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [partners, search, filterStatus]);

  const openAdd = () => {
    setForm(empty);
    setModal({ open: true, mode: "add", item: null });
  };

  const openEdit = (item: Partner) => {
    setForm({
      name: item.name,
      logo: item.logo,
      website: item.website,
      category: item.category,
      description: item.description,
      status: item.status,
    });
    setModal({ open: true, mode: "edit", item });
  };

  const openDelete = (item: Partner) => setModal({ open: true, mode: "delete", item });
  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = async () => {
    if (!form.name || !form.website) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        logo: form.logo,
        websiteUrl: form.website,
        description: form.description,
        category: form.category,
        status: form.status,
      };

      if (modal.mode === "add") {
        await createPartnerAction(payload);
      } else if (modal.item) {
        const oldData = {
          name: modal.item.name,
          logo: modal.item.logo,
          websiteUrl: modal.item.website,
          description: modal.item.description,
          category: modal.item.category,
          status: modal.item.status,
        };
        const id = modal.item.id;
        await updatePartnerAction(id, payload);
        
        pushAction({
          undo: async () => {
            await updatePartnerAction(id, oldData);
            await loadPartners();
          },
          redo: async () => {
            await updatePartnerAction(id, payload);
            await loadPartners();
          }
        });
      }

      close();
      router.refresh();
      await loadPartners();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save partner.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!modal.item) return;
    setSaving(true);
    setError(null);
    try {
      const deletedItem = modal.item;
      await deletePartnerAction(deletedItem.id);
      
      const restorePayload = {
        name: deletedItem.name,
        logo: deletedItem.logo,
        websiteUrl: deletedItem.website,
        description: deletedItem.description,
        category: deletedItem.category,
        status: deletedItem.status,
      };
      
      pushAction({
        undo: async () => {
          await createPartnerAction(restorePayload);
          await loadPartners();
        },
        redo: async () => {
          await deletePartnerAction(deletedItem.id);
          await loadPartners();
        }
      });
      
      close();
      router.refresh();
      await loadPartners();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete partner.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item: Partner) => {
    setSaving(true);
    setError(null);
    try {
      const nextStatus = item.status === "Active" ? "Inactive" : "Active";
      await togglePartnerStatusAction(item.id, nextStatus);
      
      pushAction({
        undo: async () => {
          await togglePartnerStatusAction(item.id, item.status);
          await loadPartners();
        },
        redo: async () => {
          await togglePartnerStatusAction(item.id, nextStatus);
          await loadPartners();
        }
      });
      
      setPartners((prev) => prev.map((partner) => (partner.id === item.id ? { ...partner, status: nextStatus } : partner)));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update partner status.");
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof PartnerForm, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader
        icon={<Handshake size={20} style={{ color: "#FF6B00" }} />}
        title="Industry Partners"
        subtitle={`${partners.length} total partners · ${partners.filter((p) => p.status === "Active").length} active`}
        action={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => { void undo(); }}
              disabled={!canUndo || isProcessing}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${!canUndo ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-sm'}`}
              title="Undo"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={() => { void redo(); }}
              disabled={!canRedo || isProcessing}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${!canRedo ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-sm'}`}
              title="Redo"
            >
              <Redo2 size={16} />
            </button>
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold border-none hover:opacity-90 ml-2"
              style={{ background: "#FF6B00", cursor: "pointer", fontFamily: "'Satoshi', sans-serif", boxShadow: "0 2px 10px rgba(255,107,0,0.35)" }}>
              <Plus size={16} /> Add Partner
            </button>
          </div>
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

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
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "#bbb", fontSize: "14px" }}>Loading partners…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "#bbb", fontSize: "14px" }}>No partners found.</td>
                </tr>
              ) : filtered.map((partner) => (
                <tr key={partner.id} style={{ borderTop: "1px solid #f5f5f5" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "14px 16px" }}>
                    <div className="flex items-center gap-3">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} style={{ width: "36px", height: "36px", borderRadius: "10px", objectFit: "cover", border: "1px solid #eee" }} />
                      ) : (
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm bg-orange-50 text-[#FF6B00]">
                          {partner.name[0]}
                        </div>
                      )}
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
                        onClick={() => { void toggleStatus(partner); }}
                        disabled={saving}
                        className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out align-middle border-none"
                        style={{
                          background: partner.status === "Active" ? "#10b981" : "#e5e7eb",
                          outline: "none"
                        }}
                        title={partner.status === "Active" ? "Disable" : "Enable"}
                      >
                        <span
                          className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out"
                          style={{ transform: partner.status === "Active" ? "translateX(16px)" : "translateX(0)" }}
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
              <FormField label="Logo Image">
                <ImageUpload
                  uploadType="community_member_photo"
                  value={form.logo}
                  onChange={(url) => set("logo", url)}
                />
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
              <Select value={form.status} onChange={(e) => set("status", e.target.value as "Active" | "Inactive")}>
                <option>Active</option>
                <option>Inactive</option>
              </Select>
            </FormField>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <GhostBtn onClick={close}>Cancel</GhostBtn>
              <PrimaryBtn onClick={() => { void save(); }} disabled={saving}>{saving ? "Saving..." : modal.mode === "add" ? "Add Partner" : "Save Changes"}</PrimaryBtn>
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
          <DangerBtn onClick={() => { void remove(); }}>Remove</DangerBtn>
        </div>
      </Modal>
    </div>
  );
}
