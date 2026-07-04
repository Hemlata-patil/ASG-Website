import { useState } from "react";
import { Plus, Search, GraduationCap, Check, X as XIcon, UploadCloud, Eye, Pencil, Trash2, HelpCircle } from "lucide-react";
import Modal, { FormField, Input, Select, Textarea, PrimaryBtn, DangerBtn, GhostBtn } from "../components/Modal";
import { PageHeader } from "./EventsPage";

const DUMMY_MENTORS = [
  { id: 1, name: "Dr. Sandeep Joshi", expertise: "IP & Academic Research" },
  { id: 2, name: "Milind Kulkarni", expertise: "Cloud & Microservices Architecture" },
  { id: 3, name: "Anjali Sharma", expertise: "Marketing Strategy & GTM" },
  { id: 4, name: "Rohan Deshmukh", expertise: "B2B Sales & Corporate Partnerships" },
  { id: 5, name: "Priya Mehta", expertise: "Product Management & UX" },
  { id: 6, name: "Vivek Patil", expertise: "AI/ML & Data Science" },
  { id: 7, name: "Neha Joshi", expertise: "Legal & Startup Compliance" },
  { id: 8, name: "Aakash Desai", expertise: "Finance & Fundraising" },
];

type AALType = "Intern" | "Problem Statement" | "Application";

interface AALItem {
  id: number;
  type: AALType;
  title: string; // Used as Name for Interns/Applications, and Title for Problem Statements
  description: string;
  // Intern & Application fields
  internName?: string;
  internEmail?: string;
  phone?: string;
  college?: string;
  course?: string;
  year?: string;
  mentor?: string;
  photo?: string;
  github?: string;
  notes?: string; // Why join
  aiToolsUsed?: string;
  shortDescription?: string;
  // Application fields
  isExistingIntern?: boolean;
  // Common fields
  domain?: string;
  status: "Active" | "Completed" | "Pending" | "Accepted" | "Rejected" | "Inactive";
  startDate?: string;
  endDate?: string;
  // Problem Statement fields
  icon?: string; // Icon URL or emoji
}

const INITIAL: AALItem[] = [
  // Interns
  {
    id: 1,
    type: "Intern",
    title: "Rahul Kulkarni",
    internName: "Rahul Kulkarni",
    internEmail: "rahul.k@asg.io",
    phone: "+91 98765 43220",
    college: "SSBT COET Jalgaon",
    course: "B.Tech Computer Engineering",
    year: "3rd Year",
    description: "Working on Career Intelligence Platform",
    domain: "Career Intelligence",
    mentor: "Dr. Sandeep Joshi",
    status: "Active",
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    github: "https://github.com/rahulkulkarni",
    notes: "I want to build real-world AI applications that solve local recruitment problems.",
    aiToolsUsed: "ChatGPT, GitHub Copilot, v0.dev",
    shortDescription: "Frontend developer specialized in React and Tailwind CSS."
  },
  {
    id: 2,
    type: "Intern",
    title: "Nisha Patil",
    internName: "Nisha Patil",
    internEmail: "nisha.p@asg.io",
    phone: "+91 98765 43221",
    college: "KCE Society Jalgaon",
    course: "B.Sc Computer Science",
    year: "2nd Year",
    description: "UI/UX Designer for Career Intelligence Platform",
    domain: "Career Intelligence",
    mentor: "Dr. Sandeep Joshi",
    status: "Active",
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    github: "https://behance.net/nishapatil",
    notes: "Excited to design premium dashboards and user interfaces for AI portals.",
    aiToolsUsed: "Figma AI, Midjourney, Canva",
    shortDescription: "Creative UI/UX designer with a strong eye for clean typography and dark themes."
  },
  {
    id: 3,
    type: "Intern",
    title: "Tejas Patil",
    internName: "Tejas Patil",
    internEmail: "tejas.p@asg.io",
    phone: "+91 98765 43222",
    college: "GF's Godavari COE",
    course: "B.E. Information Technology",
    year: "4th Year",
    description: "Backend Developer for Social Work & Sustainability",
    domain: "Social Work",
    mentor: "Milind Kulkarni",
    status: "Active",
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    github: "https://github.com/tejaspatil",
    notes: "Deeply interested in sustainable tech and carbon footprint tracking databases.",
    aiToolsUsed: "Copilot, Claude 3.5 Sonnet, Postman AI",
    shortDescription: "Backend developer focused on Node.js, Express, and PostgreSQL."
  },

  // Problem Statements
  { id: 4, type: "Problem Statement", title: "Career Intelligence Platform", description: "An AI-powered skill mapping and resume scanner giving real-time feedback matching candidates to startups.", domain: "Career Intelligence", status: "Active", icon: "🧠" },
  { id: 5, type: "Problem Statement", title: "Social Work & Sustainability", description: "Platform tracking corporate social responsibility actions, volunteer hours, and local green initiatives.", domain: "Social Work", status: "Active", icon: "🌱" },
  { id: 6, type: "Problem Statement", title: "Digital Economy Trackers", description: "Visualizing local commerce trends, digital transaction frequencies, and retail statistics in Jalgaon.", domain: "Digital Economy", status: "Active", icon: "📊" },

  // Applications
  {
    id: 19,
    type: "Application",
    title: "Amit Sharma",
    internName: "Amit Sharma",
    internEmail: "amit.s@gmail.com",
    phone: "+91 98765 43250",
    college: "Jalgaon Institute of Technology",
    course: "B.E. Computer Science",
    year: "4th Year",
    description: "Experienced in React/Node.",
    domain: "Career Intelligence",
    status: "Pending",
    startDate: "2026-06-22",
    isExistingIntern: false,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    github: "https://github.com/amitsharma",
    notes: "I want to gain hands-on squad building experience.",
    aiToolsUsed: "ChatGPT, Copilot",
    shortDescription: "Full stack enthusiast."
  },
  {
    id: 20,
    type: "Application",
    title: "Priya Mahajan",
    internName: "Priya Mahajan",
    internEmail: "priya.m@outlook.com",
    phone: "+91 98765 43251",
    college: "KCE Society's College of Engineering",
    course: "B.Tech IT",
    year: "3rd Year",
    description: "Strong portfolio in UI/UX designing.",
    domain: "ASG Ecosystem Portal",
    status: "Pending",
    startDate: "2026-06-21",
    isExistingIntern: false,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    github: "https://behance.net/priyamahajan",
    notes: "Design is my passion and I want to apply it to AI products.",
    aiToolsUsed: "Figma, Midjourney",
    shortDescription: "UI designer."
  },
  {
    id: 21,
    type: "Application",
    title: "Rohan Chaudhari",
    internName: "Rohan Chaudhari",
    internEmail: "rohan.c@yahoo.com",
    phone: "+91 98765 43252",
    college: "SSBT COET Bambhori",
    course: "B.Tech CSE",
    year: "4th Year",
    description: "Proficient in database schemas and backend operations.",
    domain: "Digital Economy",
    status: "Pending",
    startDate: "2026-06-20",
    isExistingIntern: true,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    github: "https://github.com/rohanchaudhari",
    notes: "Existing intern looking to extend my cohort and transition to the Digital Economy tracker squad.",
    aiToolsUsed: "Claude, ChatGPT",
    shortDescription: "Backend engineer."
  },

  // New Intern Applications (Pending)
  {
    id: 22,
    type: "Application",
    title: "Sneha Pawar",
    internName: "Sneha Pawar",
    internEmail: "sneha.pawar@gmail.com",
    phone: "+91 97654 32100",
    college: "North Maharashtra University, Jalgaon",
    course: "B.Tech Computer Engineering",
    year: "3rd Year",
    description: "Passionate about machine learning and data pipelines.",
    domain: "",
    status: "Pending",
    startDate: "2026-06-25",
    isExistingIntern: false,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    github: "https://github.com/snehapawar",
    notes: "I have built ML models for crop disease detection during my project semester. Eager to apply AI skills to real-world startup problems in Jalgaon.",
    aiToolsUsed: "Python, TensorFlow, ChatGPT",
    shortDescription: "ML enthusiast with hands-on project experience in computer vision."
  },
  {
    id: 23,
    type: "Application",
    title: "Arjun Deshmukh",
    internName: "Arjun Deshmukh",
    internEmail: "arjun.deshmukh@outlook.com",
    phone: "+91 93456 78901",
    college: "SSBT College of Engineering & Technology",
    course: "B.E. Information Technology",
    year: "3rd Year",
    description: "Strong front-end developer with React and Tailwind experience.",
    domain: "",
    status: "Pending",
    startDate: "2026-06-24",
    isExistingIntern: false,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    github: "https://github.com/arjundeshmukh",
    notes: "I have freelanced for 3 local businesses building their websites. I want to contribute to ASG's ecosystem portal and learn from experienced mentors.",
    aiToolsUsed: "GitHub Copilot, v0.dev, ChatGPT",
    shortDescription: "Frontend developer specialized in React, TypeScript, and responsive UI."
  },
  {
    id: 24,
    type: "Application",
    title: "Kavya Patil",
    internName: "Kavya Patil",
    internEmail: "kavya.patil2024@gmail.com",
    phone: "+91 99887 65432",
    college: "KCE Society's College of Engineering",
    course: "B.Sc Computer Science",
    year: "2nd Year",
    description: "Creative UI/UX designer with a strong eye for premium design systems.",
    domain: "",
    status: "Pending",
    startDate: "2026-06-26",
    isExistingIntern: false,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    github: "https://behance.net/kavyapatil",
    notes: "I designed our college fest app UI that received 500+ downloads. I want to use design thinking to solve real startup challenges and grow under mentorship.",
    aiToolsUsed: "Figma AI, Midjourney, Adobe XD",
    shortDescription: "UI/UX designer focused on design systems, prototyping, and visual storytelling."
  },
  {
    id: 25,
    type: "Application",
    title: "Rahul Jadhav",
    internName: "Rahul Jadhav",
    internEmail: "rahuljadhav.dev@yahoo.com",
    phone: "+91 91234 56789",
    college: "Government College of Engineering, Jalgaon",
    course: "B.Tech Electronics & CS",
    year: "4th Year",
    description: "Experienced in Node.js, Express, and PostgreSQL backend development.",
    domain: "",
    status: "Pending",
    startDate: "2026-06-23",
    isExistingIntern: false,
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    github: "https://github.com/rahuljadhavdev",
    notes: "I have built a REST API for a campus attendance system serving 2000+ students. Looking to contribute to ASG's digital infrastructure and learn from industry leaders.",
    aiToolsUsed: "ChatGPT, Postman AI, Claude",
    shortDescription: "Backend developer with production experience in REST APIs and database design."
  }
];

const empty: Omit<AALItem, "id"> = {
  type: "Intern",
  title: "",
  description: "",
  internName: "",
  internEmail: "",
  phone: "",
  college: "",
  course: "",
  year: "3rd Year",
  mentor: "",
  photo: "",
  github: "",
  notes: "",
  aiToolsUsed: "",
  shortDescription: "",
  domain: "",
  status: "Pending",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  isExistingIntern: false,
  icon: "💡"
};

function StatusBadge({ status }: { status: AALItem["status"] }) {
  const styles: Record<string, { bg: string; color: string }> = {
    Pending:  { bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
    Accepted: { bg: "rgba(16,185,129,0.12)",  color: "#059669" },
    Rejected: { bg: "rgba(239,68,68,0.12)",   color: "#dc2626" },
    Active:   { bg: "rgba(16,185,129,0.12)",  color: "#059669" },
    Inactive: { bg: "rgba(107,114,128,0.12)", color: "#6b7280" },
    Completed:{ bg: "rgba(59,130,246,0.12)",  color: "#3b82f6" },
  };
  const s = styles[status] || { bg: "#f4f4f5", color: "#888" };
  return (
    <span style={{
      fontSize: "11px", fontWeight: 600,
      padding: "3px 10px", borderRadius: "99px",
      background: s.bg, color: s.color,
    }}>
      {status}
    </span>
  );
}

export default function AALPage() {
  const [items, setItems] = useState<AALItem[]>(() => {
    try {
      const raw = localStorage.getItem("asg_aal_items");
      if (raw) {
        const saved = JSON.parse(raw) as AALItem[];
        const savedIds = new Set(saved.map((i) => i.id));
        // Merge: keep saved data, add any new INITIAL entries not in localStorage
        const newEntries = INITIAL.filter((i) => !savedIds.has(i.id));
        const merged = [...saved, ...newEntries];
        // Persist the merged result immediately
        localStorage.setItem("asg_aal_items", JSON.stringify(merged));
        return merged;
      }
    } catch { /* ignore */ }
    return INITIAL;
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AALType>("Intern");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit" | "delete" | "view"; item: AALItem | null }>({
    open: false, mode: "add", item: null,
  });
  const [form, setForm] = useState<Omit<AALItem, "id">>(empty);
  const [dragActive, setDragActive] = useState(false);
  const [selectedProblemStatement, setSelectedProblemStatement] = useState<string>("");
  const [selectedMentor, setSelectedMentor] = useState<string>("");

  const saveItems = (newItems: AALItem[]) => {
    setItems(newItems);
    localStorage.setItem("asg_aal_items", JSON.stringify(newItems));
  };

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

  const toggleStatus = (id: number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const newStatus = item.status === "Active" ? "Inactive" : "Active";
        return { ...item, status: newStatus };
      }
      return item;
    });
    saveItems(updated);
  };

  const updateStatusDirectly = (id: number, newStatus: AALItem["status"]) => {
    saveItems(items.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
  };

  const filtered = items.filter((i) => {
    const matchType = i.type === activeTab;
    const matchSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      (i.domain?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (i.internName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchType && matchSearch;
  });

  const openAdd = () => {
    setForm({ ...empty, type: activeTab });
    setModal({ open: true, mode: "add", item: null });
  };
  const openEdit = (item: AALItem) => {
    const { id, ...rest } = item;
    setForm({ ...empty, ...rest });
    setModal({ open: true, mode: "edit", item });
  };
  const openDelete = (item: AALItem) => setModal({ open: true, mode: "delete", item });
  const openView = (item: AALItem) => {
    setSelectedProblemStatement("");
    setSelectedMentor("");
    setModal({ open: true, mode: "view", item });
  };
  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    if ((form.type === "Intern" && !form.internName) || (form.type !== "Intern" && !form.title)) return;
    if (modal.mode === "add") {
      const finalTitle = form.type === "Intern" ? (form.internName || "") : form.title;
      saveItems([...items, { ...form, title: finalTitle, id: Date.now() }]);
    } else if (modal.item) {
      const finalTitle = form.type === "Intern" ? (form.internName || "") : form.title;
      saveItems(items.map((i) => (i.id === modal.item!.id ? { ...modal.item!, ...form, title: finalTitle } : i)));
    }
    close();
  };

  const remove = () => {
    if (modal.item) saveItems(items.filter((i) => i.id !== modal.item!.id));
    close();
  };

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  // For EXISTING intern applications (unchanged workflow)
  const handleAcceptApplication = (item: AALItem) => {
    // Update the existing intern record with the new domain/info from the application
    const updated = items.map((i) => {
      if (i.id === item.id) return { ...i, status: "Accepted" as const };
      // Find matching intern by email and update their profile
      if (i.type === "Intern" && i.internEmail === item.internEmail) {
        return { ...i, domain: item.domain || i.domain, description: item.description || i.description };
      }
      return i;
    });
    saveItems(updated);
  };

  // For NEW intern applications — requires a Problem Statement to be assigned first
  const handleAcceptNewInternApplication = (item: AALItem, problemStatement: string, mentor: string) => {
    const updatedItems = items.map((i) =>
      i.id === item.id ? { ...i, status: "Accepted" as const, domain: problemStatement } : i
    );
    const newIntern: AALItem = {
      id: Date.now(),
      type: "Intern",
      title: item.internName || item.title,
      internName: item.internName || item.title,
      internEmail: item.internEmail,
      phone: item.phone,
      college: item.college,
      course: item.course,
      year: item.year,
      description: item.shortDescription || `Working on ${problemStatement} Platform`,
      domain: problemStatement,
      mentor: mentor || "TBD (To Be Assigned)",
      status: "Active",
      photo: item.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      github: item.github,
      notes: item.notes,
      aiToolsUsed: item.aiToolsUsed,
      shortDescription: item.shortDescription
    };
    saveItems([...updatedItems, newIntern]);
    close();
  };

  const handleRejectApplication = (item: AALItem) => {
    saveItems(items.map((i) => (i.id === item.id ? { ...i, status: "Rejected" as const } : i)));
  };

  const tabs: AALType[] = ["Intern", "Problem Statement", "Application"];
  const tabCounts = tabs.map(t => ({ type: t, count: items.filter(i => i.type === t).length }));

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
                  {activeTab === "Intern" && ["Photo", "Name", "Email", "Role/Description", "Domain", "Mentor", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px" }}>{h}</th>
                  ))}
                  {activeTab === "Problem Statement" && ["Icon", "Title", "Description", "Domain", "Status", "Actions"].map((h) => (
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
                        <td style={{ padding: "14px 16px" }}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleStatus(item.id)}
                              className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out align-middle"
                              style={{
                                background: item.status === "Active" ? "#10b981" : "#e5e7eb",
                                border: "none",
                                outline: "none"
                              }}
                              title={item.status === "Active" ? "Disable" : "Enable"}
                            >
                              <span
                                className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out"
                                style={{
                                  transform: item.status === "Active" ? "translateX(16px)" : "translateX(0)"
                                }}
                              />
                            </button>
                            <span style={{ fontSize: "12px", fontWeight: 500, color: item.status === "Active" ? "#10b981" : "#888" }}>
                              {item.status}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openView(item)}
                              className="p-1.5 rounded-lg transition-all bg-blue-55 bg-blue-50 text-blue-600 border-none cursor-pointer hover:bg-blue-100"
                              title="View Details"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => openEdit(item)}
                              className="p-1.5 rounded-lg transition-all bg-orange-50 text-[#FF6B00] border-none cursor-pointer hover:bg-orange-100"
                              title="Edit Details"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => openDelete(item)}
                              className="p-1.5 rounded-lg transition-all bg-red-50 text-red-500 border-none cursor-pointer hover:bg-red-100"
                              title="Remove Intern"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}

                    {activeTab === "Problem Statement" && (
                      <>
                        <td style={{ padding: "14px 16px", fontSize: "18px" }}>
                          {item.icon || "💡"}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d" }}>{item.title}</div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555", maxWidth: "300px" }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.description}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "99px", background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>{item.domain}</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <span style={{
                                display: "inline-block",
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: item.status === "Active" ? "#10b981" : (item.status === "Pending" ? "#f59e0b" : "#888")
                              }} />
                              <span style={{ fontSize: "12.5px", fontWeight: 600, color: item.status === "Active" ? "#10b981" : (item.status === "Pending" ? "#f59e0b" : "#555") }}>
                                {item.status}
                              </span>
                            </div>
                            {/* Quick status buttons */}
                            <div className="flex gap-1 mt-1">
                              <button
                                onClick={() => updateStatusDirectly(item.id, "Active")}
                                className="px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer border transition-all"
                                style={{
                                  background: item.status === "Active" ? "#10b981" : "#fff",
                                  color: item.status === "Active" ? "#fff" : "#10b981",
                                  borderColor: "#10b981"
                                }}
                              >
                                Active
                              </button>
                              <button
                                onClick={() => updateStatusDirectly(item.id, "Pending")}
                                className="px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer border transition-all"
                                style={{
                                  background: item.status === "Pending" ? "#f59e0b" : "#fff",
                                  color: item.status === "Pending" ? "#fff" : "#f59e0b",
                                  borderColor: "#f59e0b"
                                }}
                              >
                                Pending
                              </button>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEdit(item)}
                              className="p-1.5 rounded-lg transition-all bg-orange-50 text-[#FF6B00] border-none cursor-pointer hover:bg-orange-100"
                              title="Edit Problem"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => openDelete(item)}
                              className="p-1.5 rounded-lg transition-all bg-red-50 text-red-500 border-none cursor-pointer hover:bg-red-100"
                              title="Remove Problem"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
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
                              {/* New intern applications must be approved via View Details (PS must be assigned) */}
                              <button onClick={() => openView(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg border-none cursor-pointer" title="View & Approve"><Eye size={14} /></button>
                              <button onClick={() => handleRejectApplication(item)} className="p-2 bg-red-50 text-red-500 rounded-lg border-none cursor-pointer" title="Reject"><XIcon size={14} /></button>
                            </div>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <span className="text-xs text-gray-400">Processed</span>
                              <button onClick={() => openView(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg border-none cursor-pointer" title="View Details"><Eye size={14} /></button>
                            </div>
                          )}
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
                              <button onClick={() => handleAcceptApplication(item)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border-none cursor-pointer" title="Accept"><Check size={14} /></button>
                              <button onClick={() => handleRejectApplication(item)} className="p-2 bg-red-50 text-red-500 rounded-lg border-none cursor-pointer" title="Reject"><XIcon size={14} /></button>
                              <button onClick={() => openView(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg border-none cursor-pointer" title="View Details"><Eye size={14} /></button>
                            </div>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <span className="text-xs text-gray-400">Processed</span>
                              <button onClick={() => openView(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg border-none cursor-pointer" title="View Details"><Eye size={14} /></button>
                            </div>
                          )}
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

      {/* VIEW INTERN / APPLICATION DETAILS MODAL */}
      {modal.open && modal.mode === "view" && modal.item && (
        <Modal isOpen={true} onClose={close} title={`View ${modal.item.type} Details`} size="md">
          <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <img src={modal.item.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt={modal.item.internName} style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", border: "2.5px solid #FF6B00" }} />
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0d0d0d" }}>{modal.item.internName || modal.item.title}</h3>
                <p style={{ fontSize: "13px", color: "#888" }}>{modal.item.internEmail}</p>
                <div className="flex gap-1.5 mt-1.5">
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#FF6B00", background: "rgba(255,107,0,0.1)", padding: "2px 8px", borderRadius: "99px" }}>{modal.item.type}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#3b82f6", background: "rgba(59,130,246,0.1)", padding: "2px 8px", borderRadius: "99px" }}>{modal.item.domain || "No Domain"}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase" }}>Phone Number</label>
                <div style={{ fontSize: "13.5px", color: "#333", marginTop: "2px" }}>{modal.item.phone || "—"}</div>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase" }}>College / University</label>
                <div style={{ fontSize: "13.5px", color: "#333", marginTop: "2px" }}>{modal.item.college || "—"}</div>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase" }}>Degree & Course</label>
                <div style={{ fontSize: "13.5px", color: "#333", marginTop: "2px" }}>{modal.item.course || "—"}</div>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase" }}>Year of Study</label>
                <div style={{ fontSize: "13.5px", color: "#333", marginTop: "2px" }}>{modal.item.year || "—"}</div>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase" }}>Assigned Mentor</label>
                <div style={{ fontSize: "13.5px", color: "#333", marginTop: "2px" }}>{modal.item.mentor || "TBD"}</div>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase" }}>Status</label>
                <div style={{ fontSize: "13.5px", marginTop: "2px", fontWeight: 600, color: modal.item.status === "Active" ? "#10b981" : "#888" }}>{modal.item.status}</div>
              </div>
              {modal.item.startDate && (
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase" }}>Start Date</label>
                  <div style={{ fontSize: "13.5px", color: "#333", marginTop: "2px" }}>{modal.item.startDate}</div>
                </div>
              )}
              {modal.item.endDate && (
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase" }}>End Date</label>
                  <div style={{ fontSize: "13.5px", color: "#333", marginTop: "2px" }}>{modal.item.endDate}</div>
                </div>
              )}
            </div>

            {modal.item.github && (
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase" }}>GitHub / Portfolio</label>
                <div style={{ fontSize: "13px", marginTop: "2px" }}>
                  <a href={modal.item.github} target="_blank" rel="noopener noreferrer" style={{ color: "#FF6B00", textDecoration: "none", fontWeight: 500 }}>{modal.item.github} ↗</a>
                </div>
              </div>
            )}

            {modal.item.notes && (
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase" }}>Motivation / Proposal</label>
                <div style={{ fontSize: "13px", color: "#555", background: "#fcfcfc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #ebebeb", marginTop: "4px", whiteSpace: "pre-wrap" }}>
                  {modal.item.notes}
                </div>
              </div>
            )}

            {/* Assigned Problem Statement + Mentor section — only for Pending NEW intern applications */}
            {modal.item.type === "Application" && !modal.item.isExistingIntern && modal.item.status === "Pending" && (() => {
              const activeProblemStatements = items.filter(
                (i) => i.type === "Problem Statement" && i.status === "Active"
              );
              return (
                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  {/* Problem Statement Dropdown */}
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Assigned Problem Statement <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      value={selectedProblemStatement}
                      onChange={(e) => setSelectedProblemStatement(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        border: selectedProblemStatement ? "1.5px solid #10b981" : "1.5px solid #e5e7eb",
                        backgroundColor: "#fff",
                        fontSize: "13.5px",
                        color: selectedProblemStatement ? "#0d0d0d" : "#9ca3af",
                        outline: "none",
                        cursor: "pointer",
                        transition: "border-color 0.2s"
                      }}
                    >
                      <option value="">— Select a Problem Statement —</option>
                      {activeProblemStatements.map((ps) => (
                        <option key={ps.id} value={ps.title}>{ps.title}</option>
                      ))}
                    </select>
                    {activeProblemStatements.length === 0 && (
                      <p style={{ fontSize: "12px", color: "#f59e0b", marginTop: "6px" }}>⚠ No active problem statements available. Please activate one before approving.</p>
                    )}
                    {!selectedProblemStatement && (
                      <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>You must assign a Problem Statement before approving this application.</p>
                    )}
                  </div>

                  {/* Mentor Dropdown */}
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Assign Mentor <span style={{ fontSize: "10px", fontWeight: 400, color: "#9ca3af", textTransform: "none" }}>(optional — can be assigned later)</span>
                    </label>
                    <select
                      value={selectedMentor}
                      onChange={(e) => setSelectedMentor(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        border: selectedMentor ? "1.5px solid #3b82f6" : "1.5px solid #e5e7eb",
                        backgroundColor: "#fff",
                        fontSize: "13.5px",
                        color: selectedMentor ? "#0d0d0d" : "#9ca3af",
                        outline: "none",
                        cursor: "pointer",
                        transition: "border-color 0.2s"
                      }}
                    >
                      <option value="">— TBD (Assign later) —</option>
                      {DUMMY_MENTORS.map((m) => (
                        <option key={m.id} value={m.name}>{m.name} — {m.expertise}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100" style={{ marginTop: "12px" }}>
              {modal.item.type === "Application" && modal.item.status === "Pending" && (
                <>
                  {!modal.item.isExistingIntern ? (
                    // NEW intern application — requires Problem Statement selection
                    <button
                      onClick={() => handleAcceptNewInternApplication(modal.item!, selectedProblemStatement, selectedMentor)}
                      disabled={!selectedProblemStatement}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#fff",
                        background: selectedProblemStatement ? "#10b981" : "#d1d5db",
                        cursor: selectedProblemStatement ? "pointer" : "not-allowed",
                        transition: "background 0.2s"
                      }}
                    >
                      ✓ Approve & Assign
                    </button>
                  ) : (
                    // EXISTING intern application — unchanged workflow
                    <button
                      onClick={() => { handleAcceptApplication(modal.item!); close(); }}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#fff",
                        background: "#10b981",
                        cursor: "pointer"
                      }}
                    >
                      ✓ Approve Update
                    </button>
                  )}
                  <button
                    onClick={() => { handleRejectApplication(modal.item!); close(); }}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#fff",
                      background: "#ef4444",
                      cursor: "pointer"
                    }}
                  >
                    ✗ Reject
                  </button>
                </>
              )}
              <GhostBtn onClick={close}>Close</GhostBtn>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal for ADD / EDIT */}
      {modal.open && (modal.mode === "add" || modal.mode === "edit") && form.type !== "Application" && (
        <Modal isOpen={true} onClose={close} title={modal.mode === "add" ? `Add ${form.type}` : `Edit ${form.type}`} size="lg">
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 no-scrollbar">
            {form.type === "Intern" && (
              <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <FormField label="Intern Name *">
                  <Input value={form.internName || ""} onChange={(e) => set("internName", e.target.value)} placeholder="Full name" />
                </FormField>
                <FormField label="Email *">
                  <Input type="email" value={form.internEmail || ""} onChange={(e) => set("internEmail", e.target.value)} placeholder="intern@asg.io" />
                </FormField>
                <FormField label="Phone Number">
                  <Input type="tel" value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" />
                </FormField>
                <FormField label="College Name">
                  <Input value={form.college || ""} onChange={(e) => set("college", e.target.value)} placeholder="e.g. SSBT COET" />
                </FormField>
                <FormField label="Degree / Course">
                  <Input value={form.course || ""} onChange={(e) => set("course", e.target.value)} placeholder="e.g. B.Tech Computer Engineering" />
                </FormField>
                <FormField label="Year of Study">
                  <Select value={form.year || ""} onChange={(e) => set("year", e.target.value)}>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                    <option>Graduate / Other</option>
                  </Select>
                </FormField>
                <FormField label="Domain / Project">
                  <Input value={form.domain || ""} onChange={(e) => set("domain", e.target.value)} placeholder="e.g. Career Intelligence" />
                </FormField>
                <FormField label="Mentor">
                  <Input value={form.mentor || ""} onChange={(e) => set("mentor", e.target.value)} placeholder="Mentor name" />
                </FormField>
                <FormField label="GitHub Link">
                  <Input type="url" value={form.github || ""} onChange={(e) => set("github", e.target.value)} placeholder="https://github.com/username" />
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
                    <option>Inactive</option>
                    <option>Completed</option>
                  </Select>
                </FormField>

                <div style={{ gridColumn: "1 / -1" }}>
                  <FormField label="Motivation / Notes (Why join)">
                    <Textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} placeholder="Describe why this intern is joining..." rows={3} />
                  </FormField>
                </div>

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
                  <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Detailed description of the problem…" rows={4} />
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
                <FormField label="Icon (Emoji or Icon Code)">
                  <Input value={form.icon || ""} onChange={(e) => set("icon", e.target.value)} placeholder="e.g. 🧠, 📊, 🌱" />
                </FormField>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <GhostBtn onClick={close}>Cancel</GhostBtn>
              <PrimaryBtn onClick={save}>{modal.mode === "add" ? `Add ${form.type}` : "Save Changes"}</PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}

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
