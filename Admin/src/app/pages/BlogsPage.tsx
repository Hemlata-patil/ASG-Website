import { useState } from "react";
import { Plus, Search, FileText, UploadCloud } from "lucide-react";
import Modal, { FormField, Input, Select, Textarea, PrimaryBtn, DangerBtn, GhostBtn } from "../components/Modal";
import { StatusBadge } from "./DashboardHome";
import { PageHeader, ActionBtns } from "./EventsPage";

interface Blog {
  id: number;
  title: string;
  author: string;
  category: string;
  status: "Published" | "Draft";
  date: string;
  excerpt: string;
  readTime: string;
  thumbnailUrl?: string;
}

const INITIAL: Blog[] = [
  { id: 1, title: "Scaling Tech in Tier 2/3 Cities: The Jalgaon Blueprint", author: "ASG Editor", category: "Ecosystem", status: "Published", date: "2026-06-12", excerpt: "How grassroots communities are building high-performance tech squads and scaling regional startups from outside major metros.", readTime: "5 min read", thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop" },
  { id: 2, title: "RAG & LLMs: Practical AI Engineering inside Launchpads", author: "AI Lab Squad", category: "Technology", status: "Published", date: "2026-05-28", excerpt: "A deep dive into model selections, prompt metrics, and structuring vector search directories for students building real projects.", readTime: "7 min read", thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=300&auto=format&fit=crop" },
  { id: 3, title: "Bridging the Gap: Academic Curriculums vs Startup Operations", author: "Academic Advisors", category: "Education", status: "Published", date: "2026-05-10", excerpt: "Why hands-on team structures and weekly expert reviews are essential to transition engineering students into production builders.", readTime: "4 min read", thumbnailUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=300&auto=format&fit=crop" }
];

const CATEGORIES = ["Ecosystem", "Technology", "Education"];

const empty: Omit<Blog, "id"> = {
  title: "", author: "", category: "Technology", status: "Draft",
  date: "", excerpt: "", readTime: "5 min read", thumbnailUrl: "",
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Published" | "Draft">("All");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit" | "delete"; item: Blog | null }>({
    open: false, mode: "add", item: null,
  });
  const [form, setForm] = useState<Omit<Blog, "id">>(empty);
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
        set("thumbnailUrl", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const filtered = blogs.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setForm(empty); setModal({ open: true, mode: "add", item: null }); };
  const openEdit = (item: Blog) => {
    const { id, ...rest } = item;
    setForm(rest);
    setModal({ open: true, mode: "edit", item });
  };
  const openDelete = (item: Blog) => setModal({ open: true, mode: "delete", item });
  const close = () => setModal((m) => ({ ...m, open: false }));

  const save = () => {
    if (!form.title || !form.author) return;
    if (modal.mode === "add") {
      setBlogs((prev) => [...prev, { ...form, id: Date.now() }]);
    } else if (modal.item) {
      setBlogs((prev) => prev.map((b) => (b.id === modal.item!.id ? { ...modal.item!, ...form } : b)));
    }
    close();
  };

  const remove = () => {
    if (modal.item) setBlogs((prev) => prev.filter((b) => b.id !== modal.item!.id));
    close();
  };

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader
        icon={<FileText size={20} style={{ color: "#FF6B00" }} />}
        title="Blog Posts"
        subtitle={`${blogs.length} posts · ${blogs.filter((b) => b.status === "Published").length} published`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: "#FF6B00", border: "none", cursor: "pointer", fontFamily: "'Satoshi', sans-serif", boxShadow: "0 2px 10px rgba(255,107,0,0.35)" }}>
            <Plus size={16} /> New Post
          </button>
        }
      />

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
        <div className="flex flex-wrap items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #f5f5f5" }}>
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <Search size={15} style={{ color: "#bbb" }} />
            <input
              placeholder="Search posts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: "14px", color: "#555", background: "none", flex: 1, fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div className="flex gap-1">
            {(["All", "Published", "Draft"] as const).map((s) => (
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
                {["Title & Excerpt", "Author", "Category", "Read Time", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((blog) => (
                <tr key={blog.id} style={{ borderTop: "1px solid #f5f5f5" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "14px 16px", maxWidth: "340px" }}>
                    <div className="flex gap-3 items-start">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100" style={{ border: "1px solid #f0f0f0" }}>
                        <img
                          src={blog.thumbnailUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop"}
                          alt={blog.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d", marginBottom: "3px" }}>{blog.title}</div>
                        <div style={{ fontSize: "12px", color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{blog.excerpt}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555", whiteSpace: "nowrap" }}>{blog.author}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "99px", background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>{blog.category}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#8a8a8a", whiteSpace: "nowrap" }}>{blog.readTime}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#8a8a8a", whiteSpace: "nowrap" }}>
                    {new Date(blog.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px" }}><StatusBadge status={blog.status} /></td>
                  <td style={{ padding: "14px 16px" }}>
                    <ActionBtns onEdit={() => openEdit(blog)} onDelete={() => openDelete(blog)} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "40px 16px", textAlign: "center", color: "#bbb", fontSize: "14px" }}>No posts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modal.open && modal.mode !== "delete"} onClose={close} title={modal.mode === "add" ? "New Blog Post" : "Edit Post"} size="lg">
        <FormField label="Blog Thumbnail/Banner * (Drag and drop or click to upload)">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            style={{
              borderColor: dragActive ? "#FF6B00" : "#ebebeb",
              background: dragActive ? "rgba(255,107,0,0.04)" : "#f8f8f8",
              borderStyle: "dashed",
              borderWidth: "2px",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginBottom: "8px"
            }}
            onClick={() => document.getElementById("blog-file-upload")?.click()}
          >
            <input
              id="blog-file-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            {form.thumbnailUrl ? (
              <div className="relative w-full flex flex-col items-center">
                <img
                  src={form.thumbnailUrl}
                  alt="Preview"
                  style={{ maxHeight: "140px", borderRadius: "8px", objectFit: "cover", marginBottom: "8px" }}
                />
                <span style={{ fontSize: "11px", color: "#8a8a8a", fontWeight: 500 }}>Click or drag a new image to replace</span>
              </div>
            ) : (
              <>
                <UploadCloud size={28} style={{ color: "#FF6B00", opacity: 0.8, marginBottom: "8px" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#3a3a3a", marginBottom: "2px" }}>Drag and drop your thumbnail here</span>
                <span style={{ fontSize: "11px", color: "#8a8a8a" }}>or click to browse local files</span>
              </>
            )}
          </div>
        </FormField>
        <FormField label="Or Thumbnail URL">
          <Input value={form.thumbnailUrl} onChange={(e) => set("thumbnailUrl", e.target.value)} placeholder="https://…" />
        </FormField>
        <FormField label="Title *">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Post title…" />
        </FormField>
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <FormField label="Author *">
            <Input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Author name" />
          </FormField>
          <FormField label="Category">
            <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="Publish Date">
            <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </FormField>
          <FormField label="Read Time">
            <Input value={form.readTime} onChange={(e) => set("readTime", e.target.value)} placeholder="e.g. 5 min" />
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option>Draft</option>
              <option>Published</option>
            </Select>
          </FormField>
        </div>
        <FormField label="Excerpt">
          <Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Brief summary of the post…" />
        </FormField>
        <div className="flex justify-end gap-3 mt-2">
          <GhostBtn onClick={close}>Cancel</GhostBtn>
          <PrimaryBtn onClick={save}>{modal.mode === "add" ? "Create Post" : "Save Changes"}</PrimaryBtn>
        </div>
      </Modal>

      <Modal isOpen={modal.open && modal.mode === "delete"} onClose={close} title="Delete Post" size="sm">
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
          Delete <strong>"{modal.item?.title}"</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <GhostBtn onClick={close}>Cancel</GhostBtn>
          <DangerBtn onClick={remove}>Delete Post</DangerBtn>
        </div>
      </Modal>
    </div>
  );
}
