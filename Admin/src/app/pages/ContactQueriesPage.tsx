import { useState } from "react";
import { Search, Mail, Eye, Check, Reply } from "lucide-react";
import Modal, { PrimaryBtn, GhostBtn } from "../components/Modal";
import { PageHeader } from "./EventsPage";
import { StatusBadge } from "./DashboardHome";

interface QueryItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "Pending" | "Resolved";
}

const INITIAL: QueryItem[] = [
  { id: 1, name: "Rajesh Patil", email: "rajesh.patil@outlook.com", subject: "Sponsorship for college fest", message: "Hello team, we are organizing a national level hackathon at our campus next month and would love to partner with ASG as our ecosystem sponsor. Please share the relevant contact point.", date: "2026-06-23", status: "Pending" },
  { id: 2, name: "Sneha Chaudhari", email: "sneha.c@gmail.com", subject: "Incubation application query", message: "Hi, I have a prototype ready for an agri-tech IoT device. What is the process to apply for incubation under the upcoming APEX cohort? Is there an online submission link?", date: "2026-06-22", status: "Pending" },
  { id: 3, name: "Vikram Deshmukh", email: "vikram@deshmukhventures.in", subject: "Investor partnership", message: "Enjoyed reading the Jalgaon Ecosystem Blueprint. I represent a seed fund interested in matching regional student startups with micro-VCs. Let us schedule a call.", date: "2026-06-20", status: "Resolved" }
];

export default function ContactQueriesPage() {
  const [queries, setQueries] = useState<QueryItem[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Resolved">("All");
  const [selectedQuery, setSelectedQuery] = useState<QueryItem | null>(null);
  
  // Reply drafting state
  const [replyMode, setReplyMode] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const filtered = queries.filter((q) => {
    const matchSearch =
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const resolveQuery = (id: number) => {
    setQueries((prev) => prev.map((q) => (q.id === id ? { ...q, status: "Resolved" } : q)));
    if (selectedQuery && selectedQuery.id === id) {
      setSelectedQuery((prev) => prev ? { ...prev, status: "Resolved" } : null);
    }
  };

  const handleOpenReply = (query: QueryItem) => {
    setSelectedQuery(query);
    setReplySubject(`Re: ${query.subject}`);
    setReplyMessage(`Hi ${query.name},\n\nThank you for reaching out to ASG.\n\n[Your message here]\n\nBest regards,\nAPEX Startup Group Team`);
    setReplyMode(true);
  };

  const handleSendEmailReply = () => {
    if (!selectedQuery) return;
    
    // Construct mailto link
    const mailtoUrl = `mailto:${selectedQuery.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyMessage)}`;
    window.location.href = mailtoUrl;

    // Auto resolve the query
    resolveQuery(selectedQuery.id);
    
    // Reset states
    setReplyMode(false);
    setSelectedQuery(null);
  };

  return (
    <div>
      <PageHeader
        icon={<Mail size={20} style={{ color: "#FF6B00" }} />}
        title="Contact Queries"
        subtitle={`${queries.filter((q) => q.status === "Pending").length} pending queries`}
      />

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #f5f5f5" }}>
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <Search size={15} style={{ color: "#bbb" }} />
            <input
              placeholder="Search queries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: "14px", color: "#555", background: "none", flex: 1, fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div className="flex gap-1">
            {(["All", "Pending", "Resolved"] as const).map((s) => (
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["Sender", "Email", "Subject", "Message Snippet", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((query) => (
                <tr key={query.id} style={{ borderTop: "1px solid #f5f5f5" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d" }}>{query.name}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555" }}>{query.email}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 500, color: "#0d0d0d" }}>{query.subject}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#8a8a8a", maxWidth: "250px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{query.message}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#8a8a8a", whiteSpace: "nowrap" }}>
                    {new Date(query.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <StatusBadge status={query.status} />
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedQuery(query); setReplyMode(false); }}
                        title="View Details"
                        style={{ padding: "6px", background: "none", border: "none", cursor: "pointer", color: "#8a8a8a" }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenReply(query)}
                        title="Reply over Email"
                        style={{ padding: "6px", background: "none", border: "none", cursor: "pointer", color: "#FF6B00" }}
                      >
                        <Reply size={16} />
                      </button>
                      {query.status === "Pending" && (
                        <button
                          onClick={() => resolveQuery(query.id)}
                          title="Mark Resolved"
                          style={{ padding: "6px", background: "none", border: "none", cursor: "pointer", color: "#10b981" }}
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "40px 16px", textAlign: "center", color: "#bbb", fontSize: "14px" }}>No queries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal (which can switch to Reply Drafting Mode) */}
      {selectedQuery && (
        <Modal isOpen={true} onClose={() => { setSelectedQuery(null); setReplyMode(false); }} title={replyMode ? "Draft Email Reply" : "Query Details"} size="md">
          <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {!replyMode ? (
              // Details Mode
              <>
                <div>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "#aaa" }}>From</label>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d" }}>
                    {selectedQuery.name} (<a href={`mailto:${selectedQuery.email}`} style={{ color: "#FF6B00", textDecoration: "none" }}>{selectedQuery.email}</a>)
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "#aaa" }}>Subject</label>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d" }}>{selectedQuery.subject}</div>
                </div>
                <div>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "#aaa" }}>Message</label>
                  <div style={{ fontSize: "13.5px", color: "#444", background: "#f8f8f8", padding: "12px", borderRadius: "8px", border: "1px solid #ebebeb", whiteSpace: "pre-wrap", marginTop: "4px" }}>
                    {selectedQuery.message}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span style={{ fontSize: "12px", color: "#aaa" }}>
                    Submitted on: {new Date(selectedQuery.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <div className="flex gap-2">
                    <GhostBtn onClick={() => setSelectedQuery(null)}>Close</GhostBtn>
                    <button
                      onClick={() => handleOpenReply(selectedQuery)}
                      className="px-4 py-2 bg-[#FF6B00] text-white font-semibold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1 hover:opacity-90"
                    >
                      <Reply size={13} /> Reply over Email
                    </button>
                    {selectedQuery.status === "Pending" && (
                      <PrimaryBtn onClick={() => resolveQuery(selectedQuery.id)}>Resolve Query</PrimaryBtn>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Reply Mode
              <>
                <div>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "#aaa" }}>To</label>
                  <div style={{ fontSize: "14px", fontWeight: 650, color: "#0d0d0d" }}>{selectedQuery.name} ({selectedQuery.email})</div>
                </div>
                <div>
                  <FormField label="Subject *">
                    <Input value={replySubject} onChange={(e) => setReplySubject(e.target.value)} placeholder="Email subject" />
                  </FormField>
                </div>
                <div>
                  <FormField label="Reply Message *">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={8}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1.5px solid #ebebeb",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontFamily: "'Inter', sans-serif",
                        outline: "none",
                        resize: "vertical"
                      }}
                      placeholder="Type your response here..."
                    />
                  </FormField>
                </div>
                <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
                  <GhostBtn onClick={() => setReplyMode(false)}>Back</GhostBtn>
                  <button
                    onClick={handleSendEmailReply}
                    className="px-4 py-2 bg-[#FF6B00] text-white font-semibold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 hover:opacity-90 shadow-md"
                  >
                    <Mail size={13} /> Send & Resolve
                  </button>
                </div>
              </>
            )}

          </div>
        </Modal>
      )}
    </div>
  );
}
