import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Milestone, UploadCloud } from "lucide-react";
import Modal, { FormField, Input, Textarea, PrimaryBtn, DangerBtn, GhostBtn } from "../components/Modal";
import { PageHeader } from "./EventsPage";

interface Initiative {
  id: number;
  icon: string; // emoji or icon URL
  title: string;
  shortDescription: string;
}

const INITIAL: Initiative[] = [
  { id: 1, icon: "💡", title: "Mentorship Circles", shortDescription: "Weekly group mentorship sessions matching cohorts with domain leaders from top tech firms." },
  { id: 2, icon: "🚀", title: "AI Sandbox", shortDescription: "Hands-on cloud resource sandbox and API credits to prototype AI integrations swiftly." },
  { id: 3, icon: "💼", title: "Pitch Launchpad", shortDescription: "Preparation sprints culminating in Pitch Days to secure regional investor feedback and backing." }
];

const empty: Omit<Initiative, "id"> = {
  icon: "💡",
  title: "",
  shortDescription: ""
};

export default function ASGInitiativesPage() {
  const [initiatives, setInitiatives] = useState<Initiative[]>(() => {
    const local = localStorage.getItem("asg_initiatives");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return INITIAL;
      }
    }
    localStorage.setItem("asg_initiatives", JSON.stringify(INITIAL));
    return INITIAL;
  });

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit" | "delete"; item: Initiative | null }>({
    open: false, mode: "add", item: null
  });
  const [form, setForm] = useState<Omit<Initiative, "id">>(empty);

  const saveToStorage = (updated: Initiative[]) => {
    localStorage.setItem("asg_initiatives", JSON.stringify(updated));
  };

  const filtered = initiatives.filter((i) => {
    return (
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.shortDescription.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openAdd = () => {
    setForm(empty);
    setModal({ open: true, mode: "add", item: null });
  };

  const openEdit = (item: Initiative) => {
    const { id, ...rest } = item;
    setForm(rest);
    setModal({ open: true, mode: "edit", item });
  };

  const openDelete = (item: Initiative) => setModal({ open: true, mode: "delete", item });
  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    if (!form.title || !form.shortDescription) return;
    setInitiatives((prev) => {
      let next;
      if (modal.mode === "add") {
        next = [...prev, { ...form, id: Date.now() }];
      } else {
        next = prev.map((i) => (i.id === modal.item!.id ? { ...modal.item!, ...form } : i));
      }
      saveToStorage(next);
      return next;
    });
    close();
  };

  const remove = () => {
    if (modal.item) {
      setInitiatives((prev) => {
        const next = prev.filter((i) => i.id !== modal.item!.id);
        saveToStorage(next);
        return next;
      });
    }
    close();
  };

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader
        icon={<Milestone size={20} style={{ color: "#FF6B00" }} />}
        title="ASG Initiatives"
        subtitle={`${initiatives.length} total initiatives managed`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: "#FF6B00", border: "none", cursor: "pointer", fontFamily: "'Satoshi', sans-serif", boxShadow: "0 2px 10px rgba(255,107,0,0.35)" }}>
            <Plus size={16} /> Add Initiative
          </button>
        }
      />

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
        {/* Search */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #f5f5f5" }}>
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <Search size={15} style={{ color: "#bbb" }} />
            <input
              placeholder="Search initiatives…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: "14px", color: "#555", background: "none", flex: 1, fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["Icon", "Title", "Short Description", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((init) => (
                <tr key={init.id} style={{ borderTop: "1px solid #f5f5f5" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "14px 16px", fontSize: "20px" }}>{init.icon}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 600, color: "#0d0d0d" }}>{init.title}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555", maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {init.shortDescription}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(init)}
                        style={{ padding: "6px", background: "none", border: "none", cursor: "pointer", color: "#FF6B00" }}
                        title="Edit initiative"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => openDelete(init)}
                        style={{ padding: "6px", background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}
                        title="Delete initiative"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "40px 16px", textAlign: "center", color: "#bbb", fontSize: "14px" }}>No initiatives found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {modal.open && (modal.mode === "add" || modal.mode === "edit") && (
        <Modal isOpen={true} onClose={close} title={modal.mode === "add" ? "Add Initiative" : "Edit Initiative"} size="md">
          <div className="space-y-4">
            <FormField label="Icon (Emoji or Icon Symbol) *">
              <Input value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="e.g. 💡 or 🚀" />
            </FormField>
            <FormField label="Title *">
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Mentorship Circles" />
            </FormField>
            <FormField label="Short Description *">
              <Textarea value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="Describe the initiative, its goals, and what cohorts get from it…" rows={3} />
            </FormField>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <GhostBtn onClick={close}>Cancel</GhostBtn>
              <PrimaryBtn onClick={save}>{modal.mode === "add" ? "Add Initiative" : "Save Changes"}</PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal for Delete */}
      <Modal isOpen={modal.open && modal.mode === "delete"} onClose={close} title="Remove Initiative" size="sm">
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
          Remove initiative <strong>"{modal.item?.title}"</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <GhostBtn onClick={close}>Cancel</GhostBtn>
          <DangerBtn onClick={remove}>Remove</DangerBtn>
        </div>
      </Modal>
    </div>
  );
}
