import { useState } from "react";
import { Search, Users, Plus } from "lucide-react";
import Modal, {
  FormField,
  Input,
  Select,
  PrimaryBtn,
  DangerBtn,
  GhostBtn,
} from "../components/Modal";
import { StatusBadge } from "./DashboardHome";
import { PageHeader, ActionBtns } from "./EventsPage";

interface Member {
  id: number;
  name: string;
  email: string;
  type:
  | "Founder"
  | "Mentor"
  | "Investor"
  | "Service Provider"
  | "Member";
  company?: string;
  expertise?: string;
  city: string;
  joinDate: string;
  status: "Active" | "Inactive";
  showOnWebsite: boolean;
}

const INITIAL: Member[] = [
  // Founders
  {
    id: 1,
    name: "Vikram Singh",
    email: "vikram@asg.io",
    type: "Founder",
    company: "ASG Foundation",
    expertise: "Entrepreneurship",
    city: "Bangalore",
    joinDate: "2022-01-15",
    status: "Active",
    showOnWebsite: true,
  },
  {
    id: 2,
    name: "Priya Nair",
    email: "priya@asg.io",
    type: "Founder",
    company: "ASG Foundation",
    expertise: "Operations",
    city: "Mumbai",
    joinDate: "2022-01-15",
    status: "Active",
    showOnWebsite: true,
  },

  // Mentors
  {
    id: 3,
    name: "Dr. Ravi Kumar",
    email: "ravi.kumar@edu.in",
    type: "Mentor",
    company: "IIT Bombay",
    expertise: "AI & Machine Learning",
    city: "Mumbai",
    joinDate: "2023-03-10",
    status: "Active",
    showOnWebsite: true,
  },
  {
    id: 4,
    name: "Sneha Joshi",
    email: "sneha.joshi@tech.com",
    type: "Mentor",
    company: "Google India",
    expertise: "Product Management",
    city: "Bangalore",
    joinDate: "2023-05-20",
    status: "Active",
    showOnWebsite: true,
  },
  {
    id: 5,
    name: "Kiran Rao",
    email: "kiran.rao@blockchain.io",
    type: "Mentor",
    company: "Polygon",
    expertise: "Blockchain & Web3",
    city: "Pune",
    joinDate: "2023-08-15",
    status: "Active",
    showOnWebsite: false,
  },

  // Investors
  {
    id: 6,
    name: "Amit Verma",
    email: "amit@ventures.com",
    type: "Investor",
    company: "Sequoia Capital",
    expertise: "Early Stage Ventures",
    city: "Delhi",
    joinDate: "2023-06-01",
    status: "Active",
    showOnWebsite: true,
  },
  {
    id: 7,
    name: "Neha Sharma",
    email: "neha@angelnet.in",
    type: "Investor",
    company: "Angel Network",
    expertise: "Angel Investing",
    city: "Hyderabad",
    joinDate: "2023-09-10",
    status: "Active",
    showOnWebsite: true,
  },

  // Service Providers
  {
    id: 8,
    name: "Rajesh Patel",
    email: "rajesh@legalservices.com",
    type: "Service Provider",
    company: "Legal Advisors LLP",
    expertise: "Legal Services",
    city: "Ahmedabad",
    joinDate: "2024-01-05",
    status: "Active",
    showOnWebsite: true,
  },
  {
    id: 9,
    name: "Meera Reddy",
    email: "meera@marketing.co",
    type: "Service Provider",
    company: "BrandCraft",
    expertise: "Marketing & Branding",
    city: "Chennai",
    joinDate: "2024-02-12",
    status: "Active",
    showOnWebsite: true,
  },

  // Members
  {
    id: 10,
    name: "Arjun Sharma",
    email: "arjun@member.com",
    type: "Member",
    expertise: "Software Development",
    city: "Delhi",
    joinDate: "2024-03-10",
    status: "Active",
    showOnWebsite: true,
  },
  {
    id: 11,
    name: "Kavya Iyer",
    email: "kavya@member.com",
    type: "Member",
    expertise: "Data Science",
    city: "Kochi",
    joinDate: "2024-04-15",
    status: "Active",
    showOnWebsite: true,
  },
];

const empty: Omit<Member, "id"> = {
  name: "",
  email: "",
  type: "Member",
  company: "",
  expertise: "",
  city: "",
  joinDate: "",
  status: "Active",
  showOnWebsite: true,
};

export default function CommunityPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] =
    useState<Member["type"]>("Founder");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "add" | "edit" | "delete";
    item: Member | null;
  }>({
    open: false,
    mode: "add",
    item: null,
  });
  const [form, setForm] = useState<Omit<Member, "id">>(empty);

  const toggleShowOnWebsite = (id: number) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, showOnWebsite: !m.showOnWebsite } : m))
    );
  };

  const filtered = members.filter((m) => {
    const matchType = m.type === activeTab;
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.company
        ?.toLowerCase()
        .includes(search.toLowerCase()) ??
        false) ||
      (m.expertise
        ?.toLowerCase()
        .includes(search.toLowerCase()) ??
        false);
    const matchStatus =
      filterStatus === "All" || m.status === filterStatus;
    return matchType && matchSearch && matchStatus;
  });

  const openAdd = () => {
    setForm({ ...empty, type: activeTab });
    setModal({ open: true, mode: "add", item: null });
  };
  const openEdit = (item: Member) => {
    const { id, ...rest } = item;
    setForm(rest);
    setModal({ open: true, mode: "edit", item });
  };
  const openDelete = (item: Member) =>
    setModal({ open: true, mode: "delete", item });
  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    if (!form.name || !form.email) return;
    if (modal.mode === "add") {
      setMembers((prev) => [
        ...prev,
        { ...form, id: Date.now() },
      ]);
    } else if (modal.item) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === modal.item!.id
            ? { ...modal.item!, ...form }
            : m,
        ),
      );
    }
    close();
  };

  const remove = () => {
    if (modal.item)
      setMembers((prev) =>
        prev.filter((m) => m.id !== modal.item!.id),
      );
    close();
  };

  const set = (k: keyof typeof form, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  const tabs: Member["type"][] = [
    "Founder",
    "Mentor",
    "Investor",
    "Service Provider",
    "Member",
  ];
  const tabCounts = tabs.map((t) => ({
    type: t,
    count: members.filter(
      (m) => m.type === t && m.status === "Active",
    ).length,
  }));

  return (
    <div>
      <PageHeader
        icon={<Users size={20} style={{ color: "#FF6B00" }} />}
        title="Community Members"
        subtitle={`${members.length} total · ${members.filter((m) => m.status === "Active").length} active`}
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{
              background: "#FF6B00",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Satoshi', sans-serif",
              boxShadow: "0 2px 10px rgba(255,107,0,0.35)",
            }}
          >
            <Plus size={16} /> Add {activeTab}
          </button>
        }
      />

      {/* Tabs */}
      <div
        className="mb-5 flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count =
            tabCounts.find((t) => t.type === tab)?.count || 0;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap"
              style={{
                background: isActive ? "#FF6B00" : "#fff",
                color: isActive ? "#fff" : "#555",
                border: isActive
                  ? "1px solid #FF6B00"
                  : "1px solid #e5e5e5",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 500,
                boxShadow: isActive
                  ? "0 2px 8px rgba(255,107,0,0.25)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <span>{tab}</span>
              <span
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(0,0,0,0.06)",
                  color: isActive ? "#fff" : "#888",
                  padding: "2px 7px",
                  borderRadius: "99px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          className="flex flex-wrap items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid #f5f5f5" }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <Search size={15} style={{ color: "#bbb" }} />
            <input
              placeholder={`Search ${activeTab.toLowerCase()}s…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "#555",
                background: "none",
                flex: 1,
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>
          <div className="flex gap-1">
            {(["All", "Active", "Inactive"] as const).map(
              (s) => (
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
                    background:
                      filterStatus === s
                        ? "#FF6B00"
                        : "#f4f4f5",
                    color: filterStatus === s ? "#fff" : "#555",
                    transition: "all 0.15s",
                  }}
                >
                  {s}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {[
                  "Name",
                  "Company/Expertise",
                  "City",
                  "Joined",
                  "Show on Website",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#aaa",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      padding: "12px 16px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr
                  key={member.id}
                  style={{ borderTop: "1px solid #f5f5f5" }}
                  onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "#fafafa")
                  }
                  onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "transparent")
                  }
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `hsl(${(member.name.charCodeAt(0) * 37) % 360}, 60%, 92%)`,
                          color: `hsl(${(member.name.charCodeAt(0) * 37) % 360}, 60%, 40%)`,
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        {member.name[0]}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#0d0d0d",
                          }}
                        >
                          {member.name}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#aaa",
                          }}
                        >
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {member.company && (
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#0d0d0d",
                        }}
                      >
                        {member.company}
                      </div>
                    )}
                    {member.expertise && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginTop: member.company
                            ? "2px"
                            : "0",
                        }}
                      >
                        {member.expertise}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: "13px",
                      color: "#555",
                    }}
                  >
                    {member.city}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: "13px",
                      color: "#8a8a8a",
                    }}
                  >
                    {new Date(
                      member.joinDate,
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  {/* Inline visibility toggle switch */}
                  <td style={{ padding: "14px 16px" }}>
                    <button
                      onClick={() => toggleShowOnWebsite(member.id)}
                      className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out align-middle"
                      style={{
                        background: member.showOnWebsite ? "#FF6B00" : "#d1d5db",
                        border: "none",
                        outline: "none"
                      }}
                    >
                      <span
                        className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out"
                        style={{
                          transform: member.showOnWebsite ? "translateX(16px)" : "translateX(0)"
                        }}
                      />
                    </button>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <StatusBadge status={member.status} />
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <ActionBtns
                      onEdit={() => openEdit(member)}
                      onDelete={() => openDelete(member)}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "40px 16px",
                      textAlign: "center",
                      color: "#bbb",
                      fontSize: "14px",
                    }}
                  >
                    No {activeTab.toLowerCase()}s found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modal.open && modal.mode !== "delete"}
        onClose={close}
        title={
          modal.mode === "add"
            ? `Add ${form.type}`
            : `Edit ${form.type}`
        }
        size="md"
      >
        <FormField label="Full Name *">
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Full name"
          />
        </FormField>
        <FormField label="Email *">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="email@example.com"
          />
        </FormField>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <FormField label="Type">
            <Select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {tabs.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="City">
            <Input
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="City"
            />
          </FormField>
          <FormField label="Company">
            <Input
              value={form.company || ""}
              onChange={(e) => set("company", e.target.value)}
              placeholder="Company name"
            />
          </FormField>
          <FormField label="Expertise">
            <Input
              value={form.expertise || ""}
              onChange={(e) => set("expertise", e.target.value)}
              placeholder="Area of expertise"
            />
          </FormField>
          <FormField label="Join Date">
            <Input
              type="date"
              value={form.joinDate}
              onChange={(e) => set("joinDate", e.target.value)}
            />
          </FormField>
          <FormField label="Status">
            <Select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
            </Select>
          </FormField>
        </div>

        {/* Show on website visibility checkbox */}
        <div style={{ marginTop: "12px" }}>
          <FormField label="Show Profile on Website">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
              <input
                type="checkbox"
                checked={form.showOnWebsite}
                onChange={(e) => set("showOnWebsite", e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#FF6B00", cursor: "pointer" }}
              />
              <span style={{ fontSize: "13px", color: "#555" }}>Choose whether to show this member's info on the public portal</span>
            </div>
          </FormField>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <GhostBtn onClick={close}>Cancel</GhostBtn>
          <PrimaryBtn onClick={save}>
            {modal.mode === "add"
              ? `Add ${form.type}`
              : "Save Changes"}
          </PrimaryBtn>
        </div>
      </Modal>

      <Modal
        isOpen={modal.open && modal.mode === "delete"}
        onClose={close}
        title={`Remove ${modal.item?.type}`}
        size="sm"
      >
        <p
          style={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "20px",
          }}
        >
          Remove <strong>"{modal.item?.name}"</strong> from the
          community? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <GhostBtn onClick={close}>Cancel</GhostBtn>
          <DangerBtn onClick={remove}>Remove</DangerBtn>
        </div>
      </Modal>
    </div>
  );
}
