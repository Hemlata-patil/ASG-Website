import { useState } from "react";
import { Plus, Search, GraduationCap, Check, X as XIcon, UploadCloud, Eye } from "lucide-react";
import Modal, { FormField, Input, Select, Textarea, PrimaryBtn, DangerBtn, GhostBtn } from "../components/Modal";
import { StatusBadge } from "./DashboardHome";
import { PageHeader, ActionBtns } from "./EventsPage";

type AALType = "Intern" | "Problem Statement" | "Application";

interface AALItem {
  id: number;
  type: AALType;
  title: string;
  description: string;
  // Intern fields
  internName?: string;
  internEmail?: string;
  mentor?: string;
  photo?: string;
  // Application fields
  isExistingIntern?: boolean;
  // Common fields
  domain?: string;
  status: "Active" | "Completed" | "Pending" | "Accepted" | "Rejected";
  startDate?: string;
  endDate?: string;
}

const INITIAL: AALItem[] = [
  // Interns
  {
    id: 1,
    type: "Intern",
    title: "Rahul Kulkarni",
    internName: "Rahul Kulkarni",
    internEmail: "rahul.k@asg.io",
    description: "Working on Career Intelligence Platform",
    domain: "Career Intelligence",
    mentor: "Dr. Sandeep Joshi",
    status: "Active",
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop"
  },
  {
    id: 2,
    type: "Intern",
    title: "Nisha Patil",
    internName: "Nisha Patil",
    internEmail: "nisha.p@asg.io",
    description: "UI/UX Designer for Career Intelligence Platform",
    domain: "Career Intelligence",
    mentor: "Dr. Sandeep Joshi",
    status: "Active",
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
  },
  {
    id: 3,
    type: "Intern",
    title: "Tejas Patil",
    internName: "Tejas Patil",
    internEmail: "tejas.p@asg.io",
    description: "Backend Developer for Social Work & Sustainability",
    domain: "Social Work",
    mentor: "Milind Kulkarni",
    status: "Active",
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  },

  // Problem Statements
  { id: 4, type: "Problem Statement", title: "Career Intelligence Platform", description: "An AI-powered skill mapping and resume scanner giving real-time feedback matching candidates to startups.", domain: "Career Intelligence", status: "Active" },
  { id: 5, type: "Problem Statement", title: "Social Work & Sustainability", description: "Platform tracking corporate social responsibility actions, volunteer hours, and local green initiatives.", domain: "Social Work", status: "Active" },
  { id: 6, type: "Problem Statement", title: "Digital Economy Trackers", description: "Visualizing local commerce trends, digital transaction frequencies, and retail statistics in Jalgaon.", domain: "Digital Economy", status: "Active" },

  // Applications
  {
    id: 19,
    type: "Application",
    title: "Amit Sharma",
    internName: "Amit Sharma",
    internEmail: "amit.s@gmail.com",
    description: "Jalgaon Institute of Technology, B.E. Computer Science. Experienced in React/Node.",
    domain: "Career Intelligence",
    status: "Pending",
    startDate: "2026-06-22",
    isExistingIntern: false,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
  },
  {
    id: 20,
    type: "Application",
    title: "Priya Mahajan",
    internName: "Priya Mahajan",
    internEmail: "priya.m@outlook.com",
    description: "KCE Society's College of Engineering. Strong portfolio in UI/UX designing.",
    domain: "ASG Ecosystem Portal",
    status: "Pending",
    startDate: "2026-06-21",
    isExistingIntern: false,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
  },
  {
    id: 21,
    type: "Application",
    title: "Rohan Chaudhari",
    internName: "Rohan Chaudhari",
    internEmail: "rohan.c@yahoo.com",
    description: "SSBT COET Bambhori. Proficient in database schemas and backend operations.",
    domain: "Digital Economy",
    status: "Pending",
    startDate: "2026-06-20",
    isExistingIntern: true,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop"
  }
];

const empty: Omit<AALItem, "id"> = {
  type: "Intern",
  title: "",
  description: "",
  internName: "",
  internEmail: "",
  mentor: "",
  photo: "",
  domain: "",
  status: "Pending",
  startDate: "",
  endDate: "",
  isExistingIntern: false
};

export default function AALPage() {
  const [items, setItems] = useState<AALItem[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AALType>("Intern");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit" | "delete"; item: AALItem | null }>({
    open: false, mode: "add", item: null,
  });
  const [form, setForm] = useState<Omit<AALItem, "id">>(empty);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        set("photo", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const filtered = items.filter((i) => {
    const matchType = i.type === activeTab;
    const matchSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      (i.domain?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchType && matchSearch;
  });

  const openAdd = () => {
    setForm({ ...empty, type: activeTab });
    setModal({ open: true, mode: "add", item: null });
  };
  const openEdit = (item: AALItem) => {
    const { id, ...rest } = item;
    setForm(rest);
    setModal({ open: true, mode: "edit", item });
  };
  const openDelete = (item: AALItem) => setModal({ open: true, mode: "delete", item });
  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    if ((form.type === "Intern" && !form.internName) || (form.type !== "Intern" && !form.title)) return;
    if (modal.mode === "add") {
      const finalTitle = form.type === "Intern" ? (form.internName || "") : form.title;
      setItems((prev) => [...prev, { ...form, title: finalTitle, id: Date.now() }]);
    } else if (modal.item) {
      setItems((prev) => prev.map((i) => (i.id === modal.item!.id ? { ...modal.item!, ...form } : i)));
    }
    close();
  };

  const remove = () => {
    if (modal.item) setItems((prev) => prev.filter((i) => i.id !== modal.item!.id));
    close();
  };

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleAcceptApplication = (item: AALItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "Accepted" } : i))
    );
    // Add to interns list
    const newIntern: AALItem = {
      id: Date.now(),
      type: "Intern",
      title: item.internName || item.title,
      internName: item.internName || item.title,
      internEmail: item.internEmail,
      description: `Working on ${item.domain} Platform`,
      domain: item.domain,
      mentor: "TBD (To Be Assigned)",
      status: "Active",
      photo: item.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };
    setItems((prev) => [...prev, newIntern]);
  };

  const handleRejectApplication = (item: AALItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "Rejected" } : i))
    );
  };

  const tabs: AALType[] = ["Intern", "Problem Statement", "Application"];
  const tabCounts = tabs.map(t => ({ type: t, count: items.filter(i => i.type === t).length }));

  // Split Application Tab
  const newApplications = filtered.filter(i => !i.isExistingIntern);
  const existingApplications = filtered.filter(i => i.isExistingIntern);

  return (
    <div>
      <PageHeader
        icon={<GraduationCap size={20} style={{ color: "#FF6B00" }} />}
        title="AAL — Apex AI Launchpad"
        subtitle={`${items.filter(i => i.type === "Intern" && i.status === "Active").length} active interns · ${items.filter(i => i.type === "Problem Statement").length} problem statements`}
        action={
          activeTab !== "Application" ? (
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "#FF6B00", border: "none", cursor: "pointer", fontFamily: "'Satoshi', sans-serif", boxShadow: "0 2px 10px rgba(255,107,0,0.35)" }}>
              <Plus size={16} /> Add {activeTab}
            </button>
          ) : null
        }
      />

      {/* Tabs */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count = tabCounts.find(t => t.type === tab)?.count || 0;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap"
              style={{
                background: isActive ? "#FF6B00" : "#fff",
                color: isActive ? "#fff" : "#555",
                border: isActive ? "1px solid #FF6B00" : "1px solid #e5e5e5",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 500,
                boxShadow: isActive ? "0 2px 8px rgba(255,107,0,0.25)" : "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <span>{tab}</span>
              <span style={{
                background: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                color: isActive ? "#fff" : "#888",
                padding: "2px 7px",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: 600,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden mb-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #f5f5f5" }}>
          <Search size={16} style={{ color: "#bbb" }} />
          <input
            placeholder={`Search AAL ${activeTab.toLowerCase()}s…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", fontSize: "14px", color: "#555", background: "none", flex: 1, fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        {activeTab !== "Application" ? (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafafa" }}>
                  {activeTab === "Intern" && ["Photo", "Name", "Email", "Problem Statement", "Domain", "Mentor", "Duration", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px" }}>{h}</th>
                  ))}
                  {activeTab === "Problem Statement" && ["Title", "Description", "Domain", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} style={{ borderTop: "1px solid #f5f5f5" }}>
                    {activeTab === "Intern" && (
                      <>
                        <td style={{ padding: "14px 16px" }}>
                          <img src={item.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt={item.internName} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d" }}>{item.internName}</div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "12px", color: "#aaa" }}>{item.internEmail}</td>
                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555", maxWidth: "220px" }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.description}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "99px", background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>{item.domain}</span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555" }}>{item.mentor}</td>
                        <td style={{ padding: "14px 16px", fontSize: "12px", color: "#8a8a8a" }}>
                          {item.startDate && item.endDate && `${new Date(item.startDate).toLocaleDateString("en-IN", { month: "short" })} → ${new Date(item.endDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`}
                        </td>
                        <td style={{ padding: "14px 16px" }}><StatusBadge status={item.status} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          <ActionBtns onEdit={() => openEdit(item)} onDelete={() => openDelete(item)} />
                        </td>
                      </>
                    )}

                    {activeTab === "Problem Statement" && (
                      <>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d" }}>{item.title}</div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555", maxWidth: "300px" }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.description}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "99px", background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>{item.domain}</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}><StatusBadge status={item.status} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          <ActionBtns onEdit={() => openEdit(item)} onDelete={() => openDelete(item)} />
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Application Tab - Dual Sub-sections */
          <div className="p-5 space-y-8">
            {/* Subsection 1: New Interns */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3" style={{ fontFamily: "'Satoshi', sans-serif" }}>New Intern Applications</h3>
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#fafafa" }}>
                      {["Photo", "Candidate", "Email", "Background/College", "Domain", "Status", "Actions"].map((h) => (
                        <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {newApplications.map((item) => (
                      <tr key={item.id} style={{ borderTop: "1px solid #f5f5f5" }}>
                        <td style={{ padding: "14px 16px" }}>
                          <img src={item.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt={item.internName} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d" }}>{item.internName}</div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "#aaa" }}>{item.internEmail}</td>
                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555" }}>{item.description}</td>
                        <td style={{ padding: "14px 16px" }}><span style={{ fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "99px", background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>{item.domain}</span></td>
                        <td style={{ padding: "14px 16px" }}><StatusBadge status={item.status} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          {item.status === "Pending" ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleAcceptApplication(item)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border-none cursor-pointer"><Check size={14} /></button>
                              <button onClick={() => handleRejectApplication(item)} className="p-2 bg-red-50 text-red-500 rounded-lg border-none cursor-pointer"><XIcon size={14} /></button>
                            </div>
                          ) : <span className="text-xs text-gray-400">Processed</span>}
                        </td>
                      </tr>
                    ))}
                    {newApplications.length === 0 && (
                      <tr><td colSpan={7} className="p-6 text-center text-xs text-gray-400">No new applications.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection 2: Existing Interns */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3" style={{ fontFamily: "'Satoshi', sans-serif" }}>Existing Intern Applications</h3>
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#fafafa" }}>
                      {["Photo", "Candidate", "Email", "Updated Project Domain", "Reason/Proposal", "Status", "Actions"].map((h) => (
                        <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {existingApplications.map((item) => (
                      <tr key={item.id} style={{ borderTop: "1px solid #f5f5f5" }}>
                        <td style={{ padding: "14px 16px" }}>
                          <img src={item.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt={item.internName} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d" }}>{item.internName}</div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "#aaa" }}>{item.internEmail}</td>
                        <td style={{ padding: "14px 16px" }}><span style={{ fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "99px", background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>{item.domain}</span></td>
                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555" }}>{item.description}</td>
                        <td style={{ padding: "14px 16px" }}><StatusBadge status={item.status} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          {item.status === "Pending" ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleAcceptApplication(item)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border-none cursor-pointer"><Check size={14} /></button>
                              <button onClick={() => handleRejectApplication(item)} className="p-2 bg-red-50 text-red-500 rounded-lg border-none cursor-pointer"><XIcon size={14} /></button>
                            </div>
                          ) : <span className="text-xs text-gray-400">Processed</span>}
                        </td>
                      </tr>
                    ))}
                    {existingApplications.length === 0 && (
                      <tr><td colSpan={7} className="p-6 text-center text-xs text-gray-400">No existing intern applications.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for ADD / EDIT */}
      <Modal isOpen={modal.open && modal.mode !== "delete"} onClose={close} title={modal.mode === "add" ? `Add ${form.type}` : `Edit ${form.type}`} size="lg">
        {form.type === "Intern" && (
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <FormField label="Intern Name *">
              <Input value={form.internName || ""} onChange={(e) => set("internName", e.target.value)} placeholder="Full name" />
            </FormField>
            <FormField label="Email">
              <Input type="email" value={form.internEmail || ""} onChange={(e) => set("internEmail", e.target.value)} placeholder="intern@asg.io" />
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Role / Description *">
                <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the intern role or problem statement…" />
              </FormField>
            </div>
            <FormField label="Domain">
              <Input value={form.domain || ""} onChange={(e) => set("domain", e.target.value)} placeholder="e.g. Career Intelligence" />
            </FormField>
            <FormField label="Mentor">
              <Input value={form.mentor || ""} onChange={(e) => set("mentor", e.target.value)} placeholder="Mentor name" />
            </FormField>
            <FormField label="Start Date">
              <Input type="date" value={form.startDate || ""} onChange={(e) => set("startDate", e.target.value)} />
            </FormField>
            <FormField label="End Date">
              <Input type="date" value={form.endDate || ""} onChange={(e) => set("endDate", e.target.value)} />
            </FormField>
            <FormField label="Status">
              <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option>Active</option>
                <option>Completed</option>
              </Select>
            </FormField>

            {/* Intern Photo Drag & Drop Upload Zone */}
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Profile Photo (Drag & Drop or Click to Upload)">
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("intern-photo-upload")?.click()}
                  style={{
                    borderColor: dragActive ? "#FF6B00" : "#ebebeb",
                    background: dragActive ? "rgba(255,107,0,0.04)" : "#fcfcfc",
                    borderStyle: "dashed",
                    borderWidth: "2px",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <input id="intern-photo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }} />
                  {form.photo ? (
                    <div className="flex flex-col items-center">
                      <img src={form.photo} alt="Intern Preview" className="w-20 h-20 rounded-full object-cover mb-2" />
                      <span className="text-[11px] text-gray-400">Click to select a different photo</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud size={24} className="text-[#FF6B00] mb-1" />
                      <span className="text-xs font-semibold text-gray-700">Drag & drop profile picture here</span>
                    </div>
                  )}
                </div>
              </FormField>
            </div>
          </div>
        )}

        {form.type === "Problem Statement" && (
          <div className="grid gap-4">
            <FormField label="Title *">
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Problem statement title" />
            </FormField>
            <FormField label="Description *">
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Detailed description of the problem…" />
            </FormField>
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <FormField label="Domain">
                <Input value={form.domain || ""} onChange={(e) => set("domain", e.target.value)} placeholder="e.g. IoT, AI" />
              </FormField>
              <FormField label="Status">
                <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
                  <option>Pending</option>
                  <option>Active</option>
                  <option>Completed</option>
                </Select>
              </FormField>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <GhostBtn onClick={close}>Cancel</GhostBtn>
          <PrimaryBtn onClick={save}>{modal.mode === "add" ? `Add ${form.type}` : "Save Changes"}</PrimaryBtn>
        </div>
      </Modal>

      <Modal isOpen={modal.open && modal.mode === "delete"} onClose={close} title={`Remove ${modal.item?.type}`} size="sm">
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
          Remove <strong>"{modal.item?.title}"</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <GhostBtn onClick={close}>Cancel</GhostBtn>
          <DangerBtn onClick={remove}>Remove</DangerBtn>
        </div>
      </Modal>
    </div>
  );
}
