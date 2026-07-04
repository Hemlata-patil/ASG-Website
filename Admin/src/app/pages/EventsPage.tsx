import { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  CalendarDays,
  Clock,
  MapPin,
  Eye,
  Download,
  Filter,
  X,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen
} from "lucide-react";
import Modal, {
  FormField,
  Input,
  Textarea,
  Select,
  PrimaryBtn,
  DangerBtn,
  GhostBtn,
} from "../components/Modal";
import { StatusBadge } from "./DashboardHome";

interface Event {
  id: number;
  title: string;
  type: "Workshop" | "Meetup" | "Expert Session" | "Demo Day" | "Founder Circle" | "Community";
  date: string;
  venue: string;
  status: "upcoming" | "past";
  thumbnail: string;
  description: string;
  tags: string[];
  registrationUrl?: string;
  recapUrl?: string;
}

const CATEGORIES = ["Workshop", "Meetup", "Expert Session", "Demo Day", "Founder Circle", "Community"] as const;
const STATUSES = ["upcoming", "past"] as const;

const INITIAL_EVENTS: Event[] = [
  {
    id: 1,
    title: "Monthly Meetups (22 Cohorts Completed)",
    type: "Meetup",
    status: "past",
    date: "2026-06-15",
    venue: "IMR Seminar Hall / Jalgaon HQ",
    description: "Our flagship monthly gathering bringing together startup founders, tech experts, and developers.",
    tags: ["#Meetup", "#Community", "#Networking", "#22Cohorts"],
    registrationUrl: "",
    recapUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Breakfast with Brilliance: Morning Founder Networking (4 Cohorts)",
    type: "Founder Circle",
    status: "past",
    date: "2026-06-20",
    venue: "Hotel President Cottage, Jalgaon",
    description: "Interactive morning coffee meetups with leading industry veterans and domain experts to exchange growth strategies.",
    tags: ["#FounderCircle", "#Mentorship", "#Breakfast", "#4Cohorts"],
    registrationUrl: "",
    recapUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Pickel Ball Meetup (1 Cohort)",
    type: "Community",
    status: "upcoming",
    date: "2026-07-10",
    venue: "Jalgaon Sports Arena",
    description: "A fun fitness-focused networking event where community founders, developers, and designers hang out over pickleball.",
    tags: ["#Pickleball", "#Community", "#Sports", "#1Cohort"],
    registrationUrl: "https://forms.gle/apex-pickleball",
    recapUrl: "",
    thumbnail: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop"
  }
];

const emptyForm: Omit<Event, "id"> = {
  title: "",
  type: "Meetup",
  date: "",
  venue: "",
  status: "upcoming",
  thumbnail: "",
  description: "",
  tags: [],
  registrationUrl: "",
  recapUrl: "",
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal control states
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "add" | "edit" | "delete" | "view";
    item: Event | null;
  }>({
    open: false,
    mode: "add",
    item: null,
  });

  // Form state
  const [form, setForm] = useState<Omit<Event, "id">>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");
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
        setField("thumbnail", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Compute metrics
  const metrics = useMemo(() => {
    const total = events.length;
    const upcomingCount = events.filter((e) => e.status === "upcoming").length;
    const pastCount = events.filter((e) => e.status === "past").length;
    return { total, upcomingCount, pastCount };
  }, [events]);

  // Filtering events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesTab = e.status === activeTab;
      const matchesSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat = filterCategory === "All" || e.type === filterCategory;
      return matchesTab && matchesSearch && matchesCat;
    });
  }, [events, search, filterCategory, activeTab]);

  // Pagination processing
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedEvents = useMemo(() => {
    const verifiedPage = currentPage > totalPages ? 1 : currentPage;
    if (verifiedPage !== currentPage) {
      setTimeout(() => setCurrentPage(verifiedPage), 0);
    }
    const startIndex = (verifiedPage - 1) * pageSize;
    return filteredEvents.slice(startIndex, startIndex + pageSize);
  }, [filteredEvents, currentPage, pageSize, totalPages]);

  // CSV Export
  const exportToCSV = () => {
    const headers = ["ID", "Title", "Type", "Status", "Date", "Venue", "Description", "Tags", "RegistrationUrl", "RecapUrl"];
    const rows = events.map(e => [
      e.id,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.type}"`,
      `"${e.status}"`,
      e.date,
      `"${e.venue.replace(/"/g, '""')}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${e.tags.join(", ")}"`,
      `"${e.registrationUrl || ""}"`,
      `"${e.recapUrl || ""}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "asg-aligned-events.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CRUD actions
  const openAdd = () => {
    setForm(emptyForm);
    setTagsInput("");
    setModal({ open: true, mode: "add", item: null });
  };

  const openView = (item: Event) => {
    setModal({ open: true, mode: "view", item });
  };

  const openEdit = (item: Event) => {
    setForm({
      title: item.title,
      type: item.type,
      date: item.date,
      venue: item.venue,
      status: item.status,
      thumbnail: item.thumbnail,
      description: item.description,
      tags: item.tags,
      registrationUrl: item.registrationUrl || "",
      recapUrl: item.recapUrl || "",
    });
    setTagsInput(item.tags.join(", "));
    setModal({ open: true, mode: "edit", item });
  };

  const openDelete = (item: Event) => {
    setModal({ open: true, mode: "delete", item });
  };

  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    if (!form.title || !form.date || !form.venue) return;
    const parsedTags = tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith("#") ? t : `#${t}`));

    const finalForm = { ...form, tags: parsedTags };

    if (modal.mode === "add") {
      setEvents((prev) => [
        { ...finalForm, id: Date.now() },
        ...prev
      ]);
    } else if (modal.item) {
      setEvents((prev) =>
        prev.map((e) => (e.id === modal.item!.id ? { ...modal.item!, ...finalForm } : e))
      );
    }
    close();
  };

  const remove = () => {
    if (modal.item) {
      setEvents((prev) => prev.filter((e) => e.id !== modal.item!.id));
    }
    close();
  };

  const setField = (k: keyof typeof form, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-[1600px] mx-auto p-1 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,107,0,0.1)" }}>
            <CalendarDays size={20} style={{ color: "#FF6B00" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              Events Management
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage website events, workshops, meetups, and expert sessions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-all"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer"
            style={{ background: "#FF6B00", border: "none", fontFamily: "'Satoshi', sans-serif" }}
          >
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-400 block mb-1">Total System Events</span>
            <span className="text-3xl font-extrabold text-gray-900 block" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {metrics.total}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-50/50">
            <BookOpen size={22} className="text-[#FF6B00]" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-400 block mb-1">Upcoming Events</span>
            <span className="text-3xl font-extrabold text-emerald-600 block" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {metrics.upcomingCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50">
            <Clock size={22} className="text-emerald-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-400 block mb-1">Past Events Logged</span>
            <span className="text-3xl font-extrabold text-gray-700 block" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {metrics.pastCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50">
            <CalendarDays size={22} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main SaaS Dashboard Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        
        {/* Filter controls section */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Tab selector based on Status */}
            <div className="flex items-center gap-1.5 bg-gray-100/70 p-1 rounded-xl w-fit">
              {["upcoming", "past"].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab as any);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                      isActive
                        ? "bg-white text-gray-900 shadow-xs border border-gray-100"
                        : "text-gray-500 hover:text-gray-950"
                    }`}
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {tab} Events
                  </button>
                );
              })}
            </div>

            {/* Search and Category Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-[260px] flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-2xs">
                <Search size={15} className="text-gray-400 mr-2 flex-shrink-0" />
                <input
                  placeholder="Search events, venue..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border-none outline-none text-xs text-gray-700 bg-transparent placeholder-gray-400"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="relative w-full sm:w-[200px] flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-2xs">
                <Filter size={14} className="text-gray-400 mr-2 flex-shrink-0" />
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border-none outline-none text-xs text-gray-700 bg-transparent cursor-pointer"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[100px]">Thumbnail</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Event Info</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Scheduled Date</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Venue</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedEvents.map((ev) => (
                <tr key={ev.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-2xs bg-gray-50">
                      <img src={ev.thumbnail || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop"} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 max-w-[320px]">
                    <div className="font-semibold text-sm text-gray-900 hover:text-[#FF6B00] transition-colors cursor-pointer" onClick={() => openView(ev)}>
                      {ev.title}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 line-clamp-1">{ev.description}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-semibold border bg-orange-50 text-orange-850 border-orange-200">
                      {ev.type}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-gray-700">
                    {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="p-4 text-xs text-gray-700 flex items-center gap-1 mt-3">
                    <MapPin size={12} className="text-gray-400" /> {ev.venue}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={ev.status === "upcoming" ? "Upcoming" : "Completed"} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => openView(ev)} title="View Details" className="p-1.5 rounded-lg border border-gray-100 bg-white text-gray-400 hover:text-gray-750 cursor-pointer shadow-2xs"><Eye size={13} /></button>
                      <button onClick={() => openEdit(ev)} title="Edit" className="p-1.5 rounded-lg border border-gray-100 bg-white text-gray-400 hover:text-[#FF6B00] cursor-pointer shadow-2xs"><Pencil size={13} /></button>
                      <button onClick={() => openDelete(ev)} title="Delete" className="p-1.5 rounded-lg border border-gray-100 bg-white text-gray-400 hover:text-red-650 cursor-pointer shadow-2xs"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {totalItems === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/20">
          <span className="text-xs text-gray-500">
            Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 cursor-pointer"><ChevronLeft size={14} /></button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button key={idx} onClick={() => setCurrentPage(idx + 1)} className={`w-7 h-7 rounded-lg text-xs font-bold border ${currentPage === idx + 1 ? "bg-[#FF6B00] border-[#FF6B00] text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{idx + 1}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 cursor-pointer"><ChevronRight size={14} /></button>
          </div>
        </div>

      </div>

      {/* DETAIL VIEW MODAL */}
      <Modal isOpen={modal.open && modal.mode === "view"} onClose={close} title="Event Information Details" size="lg">
        {modal.item && (
          <div>
            <div className="relative h-44 w-full rounded-xl overflow-hidden mb-5 bg-gray-100 border border-gray-200/50 shadow-2xs">
              <img src={modal.item.thumbnail} alt={modal.item.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded-full">{modal.item.type}</span>
              </div>
            </div>
            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "'Satoshi', sans-serif" }}>{modal.item.title}</h2>
              <p className="text-xs text-gray-400 mt-1">Status: <span className="capitalize font-bold text-[#FF6B00]">{modal.item.status}</span></p>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 mb-5">
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">Date Scheduled</span>
                <span className="text-xs font-bold text-gray-800">{modal.item.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">Venue / Location</span>
                <span className="text-xs font-bold text-gray-800">{modal.item.venue}</span>
              </div>
              {modal.item.registrationUrl && (
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase block">Registration Link</span>
                  <a href={modal.item.registrationUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#FF6B00] flex items-center gap-1">{modal.item.registrationUrl} <ExternalLink size={12} /></a>
                </div>
              )}
              {modal.item.recapUrl && (
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase block">Recap Link</span>
                  <a href={modal.item.recapUrl} className="text-xs font-bold text-gray-600">{modal.item.recapUrl}</a>
                </div>
              )}
            </div>
            <div className="mb-4">
              <span className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">Tags</span>
              <div className="flex gap-1.5 flex-wrap">
                {modal.item.tags.map(t => <span key={t} className="px-2 py-0.5 rounded bg-orange-50 text-xs text-[#FF6B00] border border-orange-100">{t}</span>)}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Description</h3>
              <p className="text-xs text-gray-600 leading-relaxed bg-white border border-gray-100 p-3.5 rounded-xl">{modal.item.description}</p>
            </div>
            <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4">
              <GhostBtn onClick={close}>Close Panel</GhostBtn>
              <PrimaryBtn onClick={() => { close(); openEdit(modal.item!); }}>Edit Event</PrimaryBtn>
            </div>
          </div>
        )}
      </Modal>

      {/* ADD / EDIT FORM MODAL */}
      <Modal isOpen={modal.open && (modal.mode === "add" || modal.mode === "edit")} onClose={close} title={modal.mode === "add" ? "Create Ecosystem Event" : "Modify Event Settings"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Event Title *">
              <Input value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. AI Agents Buildathon" />
            </FormField>
            <FormField label="Category Type *">
              <Select value={form.type} onChange={(e) => setField("type", e.target.value)}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Scheduled Date *">
              <Input type="date" value={form.date} onChange={(e) => setField("date", e.target.value)} />
            </FormField>
            <FormField label="Venue Location *">
              <Input value={form.venue} onChange={(e) => setField("venue", e.target.value)} placeholder="e.g. Bangalore Innovation Hub" />
            </FormField>
            <FormField label="Status *">
              <Select value={form.status} onChange={(e) => setField("status", e.target.value)}>
                {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Recap URL (Past)">
              <Input value={form.recapUrl} onChange={(e) => setField("recapUrl", e.target.value)} placeholder="e.g. #" />
            </FormField>
          </div>

          <FormField label="Tags (Comma separated)">
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Meetup, Community, ArtificialIntelligence" />
          </FormField>

          {/* Drag & Drop Thumbnail Zone */}
          <FormField label="Thumbnail Banner (Drag & drop or Click to Upload)">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("events-file-upload")?.click()}
              style={{
                borderColor: dragActive ? "#FF6B00" : "#e5e5e5",
                background: dragActive ? "rgba(255,107,0,0.05)" : "#fcfcfc",
                borderStyle: "dashed",
                borderWidth: "2px",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <input
                id="events-file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              {form.thumbnail ? (
                <div className="flex flex-col items-center">
                  <img src={form.thumbnail} alt="Uploaded preview" className="h-28 rounded-lg object-cover mb-2" />
                  <span className="text-[11px] text-gray-400">Drag & drop or click to replace image</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud size={30} className="text-[#FF6B00] mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Drag & drop your thumbnail image here</p>
                  <p className="text-[10px] text-gray-400 mt-1">or click to browse local folders</p>
                </div>
              )}
            </div>
          </FormField>

          <FormField label="Or Thumbnail Image URL link">
            <Input value={form.thumbnail} onChange={(e) => setField("thumbnail", e.target.value)} placeholder="https://images.unsplash.com/..." />
          </FormField>

          <FormField label="Ecosystem Description">
            <Textarea value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Detailed summary of this ecosystem event..." />
          </FormField>

          <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4">
            <GhostBtn onClick={close}>Cancel</GhostBtn>
            <PrimaryBtn onClick={save}>{modal.mode === "add" ? "Create Event" : "Save Changes"}</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal isOpen={modal.open && modal.mode === "delete"} onClose={close} title="Confirm Event Deletion" size="sm">
        {modal.item && (
          <div className="space-y-4">
            <p className="text-xs text-gray-600">
              Are you absolutely sure you want to delete the event <strong>"{modal.item.title}"</strong>?
            </p>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
              <GhostBtn onClick={close}>Cancel</GhostBtn>
              <DangerBtn onClick={remove}>Confirm Delete</DangerBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function PageHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FF6B00]/10">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-bold text-xl text-gray-900 tracking-tight" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            {title}
          </h1>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function ActionBtns({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="p-2 rounded-lg transition-all bg-[#FF6B00]/10 border-none cursor-pointer text-[#FF6B00] hover:bg-[#FF6B00]/20"
      >
        <Pencil size={13} />
      </button>
      <button
        onClick={onDelete}
        className="p-2 rounded-lg transition-all bg-red-500/10 border-none cursor-pointer text-red-500 hover:bg-red-500/20"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
