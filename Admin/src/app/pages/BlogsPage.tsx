import { useState, useEffect, useRef } from "react";
import { 
  Plus, Search, FileText, UploadCloud, Edit, Trash2, Eye, Link, Undo, Redo, 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Quote, Code, Heading1, Heading2, Heading3, Heading4,
  Smile, Image as ImageIcon, Video, HelpCircle, ArrowLeft, EyePlay, Palette, Minimize2, Maximize2, PlusCircle
} from "lucide-react";
import Modal, { FormField, Input, Select, Textarea, PrimaryBtn, DangerBtn, GhostBtn } from "../components/Modal";
import { StatusBadge } from "./DashboardHome";
import { PageHeader, ActionBtns } from "./EventsPage";

interface Blog {
  id: number;
  title: string;
  slug: string;
  author: string;
  category: string;
  tags: string[];
  status: "Published" | "Draft";
  date: string;
  excerpt: string;
  content: string;
  readTime: string;
  thumbnailUrl?: string;
  // SEO Section
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage?: string;
}

const INITIAL: Blog[] = [
  { 
    id: 1, 
    title: "Scaling Tech in Tier 2/3 Cities: The Jalgaon Blueprint", 
    slug: "scaling-tech-in-tier-2-3-cities-the-jalgaon-blueprint",
    author: "ASG Editor", 
    category: "Ecosystem", 
    status: "Published", 
    date: "2026-06-12", 
    excerpt: "How grassroots communities are building high-performance tech squads and scaling regional startups from outside major metros.", 
    readTime: "5 min read", 
    thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop",
    tags: ["Ecosystem", "Jalgaon", "Startups"],
    content: `
      <h2>The Rise of Regional Tech Hubs</h2>
      <p>Historically, building a high-growth technology startup required moving to tier-1 cities like Bangalore, Mumbai, or Pune. However, with modern collaborative software, remote learning pathways, and high-performance AI coding tools, we are proving that top-tier technology teams can be built anywhere—specifically from Jalgaon.</p>
      <blockquote>"Grassroots tech squads are the future of regional innovation. Talent is everywhere; access to opportunity is what we are building."</blockquote>
      <p>Through our cohort models, we are cultivating a generation of builders who don't just study software engineering—they launch real projects for real users.</p>
      <h3>Key Pillars of our Ecosystem</h3>
      <ul>
        <li>Collaborative peer-to-peer engineering squads</li>
        <li>Direct integration with startup problem statements</li>
        <li>Rigorous weekly code and design reviews</li>
      </ul>
      <p>As we scale this blueprint across other Tier-2 and Tier-3 cities, the results remain consistent: highly capable developers building market-ready software solutions.</p>
    `,
    metaTitle: "Scaling Tech in Tier 2/3 Cities - ASG Blogs",
    metaDescription: "How grassroots communities are building high-performance tech squads and scaling regional startups from Jalgaon.",
    keywords: "Jalgaon Tech, Startup Hub, Regional Ecosystem, AI Launchpad"
  },
  { 
    id: 2, 
    title: "RAG & LLMs: Practical AI Engineering inside Launchpads", 
    slug: "rag-llms-practical-ai-engineering-inside-launchpads",
    author: "AI Lab Squad", 
    category: "Technology", 
    status: "Published", 
    date: "2026-05-28", 
    excerpt: "A deep dive into model selections, prompt metrics, and structuring vector search directories for students building real projects.", 
    readTime: "7 min read", 
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=300&auto=format&fit=crop",
    tags: ["Technology", "AI", "LLMs", "RAG"],
    content: `
      <h2>Implementing Production RAG Pipelines</h2>
      <p>Retrieval-Augmented Generation (RAG) has become the gold standard for connecting Large Language Models to proprietary business documents. In our AI Launchpad cohorts, students are engineering complete vector-search integrations to power intelligent query systems.</p>
      <h3>Choosing the Right Embedding Models</h3>
      <p>When selecting models for enterprise search systems, students evaluate several performance parameters: latency, context window sizes, and embedding dimensions. Our latest benchmark testing demonstrates excellent results using local models hosted on accelerated cloud servers.</p>
      <pre><code>// Example initialization of our index searcher
const searchIndex = async (query) => {
  const queryVector = await getEmbeddings(query);
  const hits = await vectorDB.similaritySearch(queryVector, 5);
  return generateResponse(hits);
};</code></pre>
      <p>By using structured index architectures and clean retrieval techniques, our teams are delivering sub-second search results over thousands of pages of academic and technical documentation.</p>
    `,
    metaTitle: "RAG & LLMs AI Engineering - ASG Blogs",
    metaDescription: "A deep dive into model selections, prompt metrics, and structuring vector search directories for students.",
    keywords: "RAG, LLM, Vector Search, AI Launchpad, Python, TypeScript"
  },
  { 
    id: 3, 
    title: "Bridging the Gap: Academic Curriculums vs Startup Operations", 
    slug: "bridging-the-gap-academic-curriculums-vs-startup-operations",
    author: "Academic Advisors", 
    category: "Education", 
    status: "Published", 
    date: "2026-05-10", 
    excerpt: "Why hands-on team structures and weekly expert reviews are essential to transition engineering students into production builders.", 
    readTime: "4 min read", 
    thumbnailUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=300&auto=format&fit=crop",
    tags: ["Education", "Mentorship", "Careers"],
    content: `
      <h2>The Educational Gap</h2>
      <p>Modern academic curriculums do a great job teaching foundational logic and syntax. However, there remains a massive gap when students step onto real-world dev teams that run on continuous integration pipelines, agile standups, and high-intensity production environments.</p>
      <blockquote>"Traditional education teaches how to write code. Startup environments teach how to build value."</blockquote>
      <p>To prepare our students, we emulate modern software organization workflows. Our interns learn to write pull requests, work in cross-functional design and backend squads, and defend their design decisions in weekly review meetings.</p>
      <p>Through this immersive training, we drastically reduce the onboarding and training time, making our graduates immediately productive inside fast-paced engineering organizations.</p>
    `,
    metaTitle: "Bridging Academics and Startups - ASG Blogs",
    metaDescription: "Why hands-on team structures and weekly reviews are essential to transition students into industry builders.",
    keywords: "Academic Gap, Startup Internships, Tech Mentorship, Jalgaon Careers"
  }
];

const CATEGORIES = ["Ecosystem", "Technology", "Education", "Startup", "AI", "Innovation", "Community"];

const empty: Omit<Blog, "id"> = {
  title: "",
  slug: "",
  author: "",
  category: "Technology",
  status: "Draft",
  date: new Date().toISOString().split("T")[0],
  excerpt: "",
  content: "",
  readTime: "1 min read",
  thumbnailUrl: "",
  tags: [],
  metaTitle: "",
  metaDescription: "",
  keywords: ""
};

const FONTS = [
  { label: "Sans-Serif (Default)", value: "sans-serif" },
  { label: "Serif (Georgia)", value: "Georgia, serif" },
  { label: "Monospace (Code)", value: "Courier New, monospace" },
  { label: "Satoshi (Premium)", value: "'Satoshi', sans-serif" },
  { label: "Inter (Modern)", value: "'Inter', sans-serif" }
];

const FONT_SIZES = [
  { label: "Extra Small", value: "1" },
  { label: "Small", value: "2" },
  { label: "Medium", value: "3" },
  { label: "Large", value: "4" },
  { label: "Extra Large", value: "5" },
  { label: "Huge", value: "6" }
];

const EMOJIS = ["😀", "😂", "😍", "👍", "👎", "🎉", "🔥", "🚀", "💡", "💻", "🎨", "📝", "🤔", "👏", "✔️", "🌟", "📅", "💡"];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(() => {
    try {
      const raw = localStorage.getItem("asg_blogs");
      if (raw) {
        const saved = JSON.parse(raw) as Blog[];
        const savedIds = new Set(saved.map((b) => b.id));
        const newEntries = INITIAL.filter((b) => !savedIds.has(b.id));
        const merged = [...saved, ...newEntries];
        localStorage.setItem("asg_blogs", JSON.stringify(merged));
        return merged;
      }
    } catch { /* ignore */ }
    return INITIAL;
  });

  const saveBlogs = (updated: Blog[]) => {
    setBlogs(updated);
    localStorage.setItem("asg_blogs", JSON.stringify(updated));
  };

  // CMS Views: "list" | "edit" | "add"
  const [viewState, setViewState] = useState<"list" | "edit" | "add">("list");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Filters & List States
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Published" | "Draft">("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Blog | null }>({ open: false, item: null });

  // Form States
  const [form, setForm] = useState<Omit<Blog, "id">>(empty);
  const [tagsInput, setTagsInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  
  // Editor Extra States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState<"fore" | "back" | null>(null);
  const [emojiDropdownOpen, setEmojiDropdownOpen] = useState(false);
  
  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);

  // Auto-generate slug and pre-fill SEO on title change
  const handleTitleChange = (title: string) => {
    setForm(prev => {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      
      return {
        ...prev,
        title,
        slug,
        metaTitle: prev.metaTitle ? prev.metaTitle : `${title} - ASG Blogs`
      };
    });
  };

  // Drag and Drop Featured Image
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
        setForm(f => ({ ...f, thumbnailUrl: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Sync editor change to form, calculate word count and estimated read time
  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText || "";
      const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
      const computedMinutes = Math.max(1, Math.ceil(wordCount / 200));
      const readTime = `${computedMinutes} min read`;
      
      setForm(prev => ({
        ...prev,
        content: html,
        readTime
      }));
    }
  };

  // Setup editor when switching views
  useEffect(() => {
    if ((viewState === "edit" || viewState === "add") && editorRef.current) {
      editorRef.current.innerHTML = form.content;
      // Setup image listeners inside the contenteditable
      const images = editorRef.current.getElementsByTagName("img");
      for (let i = 0; i < images.length; i++) {
        images[i].style.cursor = "pointer";
        images[i].onclick = (e) => {
          e.stopPropagation();
          setSelectedImage(e.currentTarget as HTMLImageElement);
        };
      }
    }
  }, [viewState]);

  // Click outside listener to deselect selected image
  useEffect(() => {
    const handleDeselect = () => {
      setSelectedImage(null);
    };
    document.addEventListener("click", handleDeselect);
    return () => document.removeEventListener("click", handleDeselect);
  }, []);

  // Rich Text Editor formatting commands wrapper
  const execEditorCmd = (cmd: string, val: string = "") => {
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(cmd, false, val);
    handleEditorInput();
  };

  // Hyperlink prompt
  const handleLink = () => {
    const url = prompt("Enter hyperlink URL (e.g. https://google.com):", "https://");
    if (url) {
      execEditorCmd("createLink", url);
    }
  };

  // Content block insertions
  const insertCodeBlock = () => {
    const html = `<pre style="background: #f4f4f5; padding: 12px; border-radius: 8px; font-family: monospace; border: 1px solid #e4e4e7; margin: 8px 0; overflow-x: auto;"><code>Code block here...</code></pre>`;
    execEditorCmd("insertHTML", html);
  };

  const insertChecklist = () => {
    const html = `
      <ul style="list-style: none; padding-left: 0;">
        <li style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
          <input type="checkbox" style="width: 16px; height: 16px; accent-color: #FF6B00; cursor: pointer;" />
          <span>New check item</span>
        </li>
      </ul>
    `;
    execEditorCmd("insertHTML", html);
  };

  const insertTable = () => {
    const html = `
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e4e4e7; margin: 12px 0;">
        <thead>
          <tr style="background: #f4f4f5;">
            <th style="border: 1px solid #e4e4e7; padding: 8px; text-align: left; font-weight: 600;">Header 1</th>
            <th style="border: 1px solid #e4e4e7; padding: 8px; text-align: left; font-weight: 600;">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #e4e4e7; padding: 8px;">Cell 1</td>
            <td style="border: 1px solid #e4e4e7; padding: 8px;">Cell 2</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e4e4e7; padding: 8px;">Cell 3</td>
            <td style="border: 1px solid #e4e4e7; padding: 8px;">Cell 4</td>
          </tr>
        </tbody>
      </table>
    `;
    execEditorCmd("insertHTML", html);
  };

  // Image Upload / Insert in Rich Text Content
  const handleImageInsert = (url: string) => {
    if (url) {
      const html = `<img src="${url}" alt="Blog Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 12px auto; display: block; cursor: pointer;" />`;
      execEditorCmd("insertHTML", html);
      // Wait for DOM update and attach click listener
      setTimeout(() => {
        if (editorRef.current) {
          const imgs = editorRef.current.getElementsByTagName("img");
          for (let i = 0; i < imgs.length; i++) {
            if (imgs[i].src === url) {
              imgs[i].onclick = (e) => {
                e.stopPropagation();
                setSelectedImage(e.currentTarget as HTMLImageElement);
              };
            }
          }
        }
      }, 100);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleImageInsert(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // YouTube / Video Url Insertion
  const handleVideoInsert = () => {
    const url = prompt("Enter YouTube video link (e.g. https://www.youtube.com/watch?v=...) or direct video mp4 url:");
    if (!url) return;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // Extract video ID
      let id = "";
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        id = match[2];
      }
      if (id) {
        const embedUrl = `https://www.youtube.com/embed/${id}`;
        const html = `
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 12px; margin: 16px 0;">
            <iframe src="${embedUrl}" style="position: absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe>
          </div>
        `;
        execEditorCmd("insertHTML", html);
      } else {
        alert("Could not extract YouTube video ID. Check the URL.");
      }
    } else {
      // Direct Mp4 video block
      const html = `
        <video controls style="width: 100%; max-height: 450px; border-radius: 12px; margin: 16px 0;">
          <source src="${url}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      `;
      execEditorCmd("insertHTML", html);
    }
  };

  // Resize selected image in content
  const resizeSelectedImage = (w: string) => {
    if (selectedImage) {
      selectedImage.style.width = w;
      handleEditorInput();
    }
  };

  // Caption selected image
  const addImageCaption = () => {
    if (selectedImage) {
      const caption = prompt("Enter image caption:", "Figure: Description of the image");
      if (caption !== null) {
        // Check if there is already a figcaption after it
        const next = selectedImage.nextElementSibling;
        if (next && next.tagName === "FIGCAPTION") {
          next.innerHTML = caption;
        } else {
          const fig = document.createElement("figcaption");
          fig.style.textAlign = "center";
          fig.style.fontSize = "12px";
          fig.style.color = "#71717a";
          fig.style.marginTop = "6px";
          fig.style.fontStyle = "italic";
          fig.innerHTML = caption;
          selectedImage.insertAdjacentElement("afterend", fig);
        }
        handleEditorInput();
      }
    }
  };

  // Tags Handlers
  const handleAddTag = () => {
    const clean = tagsInput.trim().replace(/[^a-zA-Z0-9-]/g, "");
    if (clean && !form.tags.includes(clean)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, clean] }));
    }
    setTagsInput("");
  };

  const handleRemoveTag = (t: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== t) }));
  };

  // Actions
  const handleSave = (status: "Published" | "Draft") => {
    if (!form.title) {
      alert("Blog Title is required!");
      return;
    }
    if (!form.thumbnailUrl) {
      alert("Featured Image is required!");
      return;
    }

    const payload: Blog = {
      ...form,
      status,
      id: viewState === "add" ? Date.now() : editingId || Date.now()
    };

    let updatedList: Blog[];
    if (viewState === "add") {
      updatedList = [...blogs, payload];
    } else {
      updatedList = blogs.map(b => b.id === editingId ? payload : b);
    }

    saveBlogs(updatedList);
    setViewState("list");
    setEditingId(null);
  };

  const handleEditClick = (blog: Blog) => {
    setForm(blog);
    setEditingId(blog.id);
    setViewState("edit");
  };

  const handleAddNewClick = () => {
    setForm(empty);
    setEditingId(null);
    setViewState("add");
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      saveBlogs(blogs.filter(b => b.id !== deleteModal.item!.id));
      setDeleteModal({ open: false, item: null });
    }
  };

  // Filtering & Sorting List logic
  const filteredBlogs = blogs.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                        b.author.toLowerCase().includes(search.toLowerCase()) ||
                        b.excerpt.toLowerCase().includes(search.toLowerCase());
    
    const matchCategory = filterCategory === "All" || b.category === filterCategory;
    const matchStatus = filterStatus === "All" || b.status === filterStatus;

    return matchSearch && matchCategory && matchStatus;
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className={`p-1 ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}>
      {viewState === "list" ? (
        // LIST VIEW
        <>
          <PageHeader
            icon={<FileText size={20} style={{ color: "#FF6B00" }} />}
            title="Blog Posts CMS"
            subtitle={`${blogs.length} posts · ${blogs.filter((b) => b.status === "Published").length} published`}
            action={
              <button 
                onClick={handleAddNewClick} 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "#FF6B00", border: "none", cursor: "pointer", fontFamily: "'Satoshi', sans-serif", boxShadow: "0 2px 10px rgba(255,107,0,0.35)" }}
              >
                <Plus size={16} /> New CMS Post
              </button>
            }
          />

          <div className="bg-white rounded-2xl overflow-hidden mt-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 bg-gray-50/50" style={{ borderBottom: "1px solid #f5f5f5" }}>
              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 w-full max-w-sm">
                  <Search size={15} style={{ color: "#bbb" }} />
                  <input
                    placeholder="Search blogs by title, content or author…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full text-sm outline-none border-none text-gray-700 placeholder-gray-400"
                    style={{ background: "none" }}
                  />
                </div>

                {/* Category Select Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 outline-none"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Date Sort Select */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                  className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 outline-none"
                >
                  <option value="newest">Sort by: Latest first</option>
                  <option value="oldest">Sort by: Oldest first</option>
                </select>
              </div>

              {/* Status Tabs */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                {(["All", "Published", "Draft"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "9px",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      background: filterStatus === s ? "#FF6B00" : "transparent",
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
                    {["Featured Image & Title", "Author", "Category", "Read Time", "Date", "Status", "Actions"].map((h) => (
                      <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} style={{ borderTop: "1px solid #f5f5f5" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "14px 16px", maxWidth: "380px" }}>
                        <div className="flex gap-3 items-start">
                          <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-150">
                            <img
                              src={blog.thumbnailUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop"}
                              alt={blog.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d0d0d", marginBottom: "3px" }}>{blog.title}</div>
                            <div className="text-xs text-gray-400 font-mono truncate max-w-[280px]">slug: {blog.slug}</div>
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
                      <td style={{ padding: "14px 16px" }}>
                        <StatusBadge status={blog.status} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditClick(blog)} 
                            title="Edit Post"
                            className="p-1.5 text-gray-500 hover:text-orange-500 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => setDeleteModal({ open: true, item: blog })} 
                            title="Delete Post"
                            className="p-1.5 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBlogs.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: "40px 16px", textAlign: "center", color: "#bbb", fontSize: "14px" }}>No posts found matching the filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        // CMS WRITER VIEW
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-24">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewState("list")}
                className="p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-100 rounded-xl transition-all"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{viewState === "add" ? "Write Blog Post" : "Edit Blog Post"}</h1>
                <p className="text-xs text-gray-500">Upgrade your ideas to formatted web publications</p>
              </div>
            </div>
            {/* Top Bar Actions */}
            <div className="flex items-center gap-2">
              <GhostBtn onClick={() => setViewState("list")}>Cancel</GhostBtn>
              <button 
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="px-4 py-2 border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Eye size={15} /> {isPreviewMode ? "Edit Mode" : "Preview"}
              </button>
              <button 
                onClick={() => handleSave("Draft")}
                className="px-4 py-2 border border-orange-200 text-[#FF6B00] hover:bg-orange-50/50 text-sm font-semibold rounded-xl transition-all"
              >
                Save Draft
              </button>
              <button 
                onClick={() => handleSave("Published")}
                className="px-4 py-2 bg-[#FF6B00] text-white hover:opacity-95 text-sm font-semibold rounded-xl transition-all shadow-md shadow-orange-500/10"
              >
                Publish Post
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Fields */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <FormField label="Blog Title *">
                  <input 
                    value={form.title} 
                    onChange={(e) => handleTitleChange(e.target.value)} 
                    placeholder="Enter an engaging, premium title..." 
                    className="w-full text-lg font-bold border-b border-gray-100 focus:border-orange-500 outline-none pb-2 transition-colors placeholder-gray-300 text-gray-800"
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="URL Slug (auto-generated)">
                    <input 
                      value={form.slug} 
                      onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} 
                      placeholder="url-slug-format" 
                      className="w-full text-xs font-mono px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                  </FormField>
                  <FormField label="Author *">
                    <input 
                      value={form.author} 
                      onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))} 
                      placeholder="e.g. AI Lab Squad" 
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl outline-none"
                    />
                  </FormField>
                </div>
              </div>

              {/* Rich Text Editor Module */}
              <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                {/* TOOLBAR */}
                {!isPreviewMode && (
                  <div className="bg-gray-50/80 backdrop-blur-md p-2.5 border-b border-gray-200 flex flex-wrap gap-1 items-center justify-between sticky top-0 z-10">
                    <div className="flex flex-wrap gap-1 items-center">
                      
                      {/* Undo / Redo */}
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("undo"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors" title="Undo"><Undo size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("redo"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors" title="Redo"><Redo size={15} /></button>
                      <div className="w-px h-5 bg-gray-200 mx-1"></div>

                      {/* Heading Blocks Dropdown */}
                      <select 
                        onChange={(e) => { execEditorCmd("formatBlock", e.target.value); e.target.value = ""; }}
                        className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg outline-none text-gray-600 font-semibold"
                        defaultValue=""
                      >
                        <option value="" disabled>Format</option>
                        <option value="<P>">Paragraph</option>
                        <option value="<H1>">H1 Heading</option>
                        <option value="<H2>">H2 Heading</option>
                        <option value="<H3>">H3 Heading</option>
                        <option value="<H4>">H4 Heading</option>
                      </select>

                      {/* Font Family Dropdown */}
                      <select 
                        onChange={(e) => execEditorCmd("fontName", e.target.value)}
                        className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg outline-none text-gray-600"
                        defaultValue="sans-serif"
                      >
                        {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>

                      {/* Font Size Dropdown */}
                      <select 
                        onChange={(e) => execEditorCmd("fontSize", e.target.value)}
                        className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg outline-none text-gray-600"
                        defaultValue="3"
                      >
                        {FONT_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>

                      <div className="w-px h-5 bg-gray-200 mx-1"></div>

                      {/* Inline Styling */}
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("bold"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 font-bold font-serif" title="Bold"><Bold size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("italic"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 italic" title="Italic"><Italic size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("underline"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 underline" title="Underline"><Underline size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("strikeThrough"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 line-through" title="Strikethrough"><Strikethrough size={15} /></button>
                      
                      <div className="w-px h-5 bg-gray-200 mx-1"></div>

                      {/* Alignment */}
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("justifyLeft"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Align Left"><AlignLeft size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("justifyCenter"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Align Center"><AlignCenter size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("justifyRight"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Align Right"><AlignRight size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("justifyFull"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Justify"><AlignJustify size={15} /></button>

                      <div className="w-px h-5 bg-gray-200 mx-1"></div>

                      {/* Color Picker Toggles */}
                      <div className="relative flex items-center">
                        <button 
                          onMouseDown={(e) => { e.preventDefault(); setColorPickerTarget(colorPickerTarget === "fore" ? null : "fore"); }}
                          className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-0.5" 
                          title="Text Color"
                        >
                          <Palette size={15} /> <span style={{ textDecoration: "underline", fontWeight: 700 }}>A</span>
                        </button>
                        {colorPickerTarget === "fore" && (
                          <div className="absolute top-8 left-0 bg-white p-2 rounded-xl shadow-xl border border-gray-200 grid grid-cols-4 gap-1 z-35">
                            {["#000000", "#ef4444", "#f97316", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#6b7280", "#FF6B00"].map(c => (
                              <button 
                                key={c}
                                onMouseDown={(e) => { e.preventDefault(); execEditorCmd("foreColor", c); setColorPickerTarget(null); }}
                                style={{ background: c }}
                                className="w-5 h-5 rounded-md border border-gray-300"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative flex items-center">
                        <button 
                          onMouseDown={(e) => { e.preventDefault(); setColorPickerTarget(colorPickerTarget === "back" ? null : "back"); }}
                          className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-0.5" 
                          title="Highlight Color"
                        >
                          <Palette size={15} style={{ opacity: 0.7 }} /> <span className="bg-yellow-200 px-0.5 font-bold">H</span>
                        </button>
                        {colorPickerTarget === "back" && (
                          <div className="absolute top-8 left-0 bg-white p-2 rounded-xl shadow-xl border border-gray-200 grid grid-cols-4 gap-1 z-35">
                            {["#ffffff", "#fef08a", "#bbf7d0", "#bfdbfe", "#e9d5ff", "#fbcfe8", "#fed7aa", "#e4e4e7"].map(c => (
                              <button 
                                key={c}
                                onMouseDown={(e) => { e.preventDefault(); execEditorCmd("hiliteColor", c); setColorPickerTarget(null); }}
                                style={{ background: c }}
                                className="w-5 h-5 rounded-md border border-gray-300"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="w-px h-5 bg-gray-200 mx-1"></div>

                      {/* Lists */}
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("insertUnorderedList"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Bullet List"><List size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("insertOrderedList"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Numbered List"><ListOrdered size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); insertChecklist(); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Checklist"><CheckSquare size={15} /></button>

                      <div className="w-px h-5 bg-gray-200 mx-1"></div>

                      {/* Special Blocks */}
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("formatBlock", "<BLOCKQUOTE>"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Quote"><Quote size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); insertCodeBlock(); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Code Block"><Code size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("insertHorizontalRule"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Divider"><Minimize2 size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); insertTable(); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Table"><PlusCircle size={15} /></button>

                      <div className="w-px h-5 bg-gray-200 mx-1"></div>

                      {/* Hyperlinks */}
                      <button onMouseDown={(e) => { e.preventDefault(); handleLink(); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Insert Link"><Link size={15} /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); execEditorCmd("unlink"); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 line-through" title="Remove Link">unlink</button>

                      <div className="w-px h-5 bg-gray-200 mx-1"></div>

                      {/* Image / Video Insertion */}
                      <button 
                        onMouseDown={(e) => { e.preventDefault(); document.getElementById("editor-inline-image")?.click(); }}
                        className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600"
                        title="Upload Image"
                      >
                        <ImageIcon size={15} />
                        <input 
                          id="editor-inline-image" 
                          type="file" 
                          accept="image/*" 
                          style={{ display: "none" }}
                          onChange={handleMediaUpload}
                        />
                      </button>
                      <button 
                        onMouseDown={(e) => { 
                          e.preventDefault(); 
                          const url = prompt("Enter online image URL:");
                          if (url) handleImageInsert(url);
                        }} 
                        className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 text-xs font-semibold"
                        title="Image by URL"
                      >
                        URL Img
                      </button>
                      <button onMouseDown={(e) => { e.preventDefault(); handleVideoInsert(); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Embed Video / YouTube"><Video size={15} /></button>

                      <div className="w-px h-5 bg-gray-200 mx-1"></div>

                      {/* Emojis Dropdown */}
                      <div className="relative">
                        <button 
                          onMouseDown={(e) => { e.preventDefault(); setEmojiDropdownOpen(!emojiDropdownOpen); }}
                          className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600"
                          title="Insert Emoji"
                        >
                          <Smile size={15} />
                        </button>
                        {emojiDropdownOpen && (
                          <div className="absolute top-8 left-0 bg-white p-2 rounded-xl shadow-xl border border-gray-200 grid grid-cols-6 gap-1 z-35 w-40">
                            {EMOJIS.map(emoji => (
                              <button 
                                key={emoji}
                                onMouseDown={(e) => { 
                                  e.preventDefault(); 
                                  execEditorCmd("insertText", emoji);
                                  setEmojiDropdownOpen(false);
                                }}
                                className="hover:bg-gray-100 p-1 rounded text-sm text-center"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* IMAGE FLOATING EDIT OPTIONS BAR */}
                {selectedImage && !isPreviewMode && (
                  <div className="bg-orange-50 border-b border-orange-100 px-4 py-2 flex items-center justify-between text-xs text-orange-950 font-semibold gap-3 animate-fade-in z-20">
                    <div className="flex items-center gap-1">
                      <span className="text-[#FF6B00]">📸 Image Selected:</span>
                      <span>Adjust display parameters:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onMouseDown={(e) => { e.preventDefault(); resizeSelectedImage("25%"); }}
                        className="bg-white border border-orange-200 px-2 py-1 rounded hover:bg-orange-100 transition-colors"
                      >
                        25% Width
                      </button>
                      <button 
                        onMouseDown={(e) => { e.preventDefault(); resizeSelectedImage("50%"); }}
                        className="bg-white border border-orange-200 px-2 py-1 rounded hover:bg-orange-100 transition-colors"
                      >
                        50% Width
                      </button>
                      <button 
                        onMouseDown={(e) => { e.preventDefault(); resizeSelectedImage("100%"); }}
                        className="bg-white border border-orange-200 px-2 py-1 rounded hover:bg-orange-100 transition-colors"
                      >
                        Full Width (100%)
                      </button>
                      <div className="w-px h-4 bg-orange-200"></div>
                      <button 
                        onMouseDown={(e) => { e.preventDefault(); addImageCaption(); }}
                        className="bg-orange-600 text-white px-2 py-1 rounded hover:opacity-90 transition-colors"
                      >
                        Add Caption
                      </button>
                      <button 
                        onMouseDown={(e) => { e.preventDefault(); selectedImage.remove(); setSelectedImage(null); handleEditorInput(); }}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:opacity-90 transition-colors"
                      >
                        Remove Image
                      </button>
                      <button 
                        onMouseDown={(e) => { e.preventDefault(); setSelectedImage(null); }}
                        className="text-gray-400 hover:text-gray-600 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* EDITABLE DIV / PREVIEW DIV */}
                {isPreviewMode ? (
                  <div 
                    className="p-6 overflow-y-auto flex-1 bg-white text-gray-800 prose prose-orange max-w-none min-h-[400px] border-none outline-none font-sans"
                    dangerouslySetInnerHTML={{ __html: form.content || `<p style="color: #94a3b8; font-style: italic;">Nothing written yet...</p>` }}
                  />
                ) : (
                  <div 
                    ref={editorRef}
                    contentEditable
                    onInput={handleEditorInput}
                    onBlur={handleEditorInput}
                    className="p-6 overflow-y-auto flex-1 bg-white outline-none prose prose-orange max-w-none min-h-[400px] text-gray-800 font-sans"
                    style={{ minHeight: "450px" }}
                    placeholder="Start typing your rich-text blog content here..."
                  />
                )}

                <div className="bg-gray-50 px-4 py-2 border-t border-gray-150 flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span>Auto-calculated Read Time: <strong>{form.readTime}</strong></span>
                  <span>Character count: {form.content.length}</span>
                </div>
              </div>

              {/* SEO Configurations */}
              <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Search Engine Optimization (SEO)</h3>
                  <p className="text-xs text-gray-400">Configure how search engines represent this publication</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Meta Title">
                    <input 
                      value={form.metaTitle} 
                      onChange={(e) => setForm(f => ({ ...f, metaTitle: e.target.value }))} 
                      placeholder="Highly optimized search title" 
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl outline-none"
                    />
                  </FormField>
                  <FormField label="Keywords (comma-separated)">
                    <input 
                      value={form.keywords} 
                      onChange={(e) => setForm(f => ({ ...f, keywords: e.target.value }))} 
                      placeholder="e.g. Technology, AI, Startups, Jalgaon" 
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl outline-none"
                    />
                  </FormField>
                </div>
                <FormField label="Meta Description">
                  <textarea 
                    value={form.metaDescription} 
                    onChange={(e) => setForm(f => ({ ...f, metaDescription: e.target.value }))} 
                    placeholder="Short meta description to display in search indexes (max 160 characters)"
                    rows={3}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl outline-none resize-none font-sans"
                  />
                </FormField>
              </div>

            </div>

            {/* Sidebar Controls Area */}
            <div className="space-y-6">
              
              {/* Image Upload Box */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Featured Image *</label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  style={{
                    borderColor: dragActive ? "#FF6B00" : "#ebebeb",
                    background: dragActive ? "rgba(255,107,0,0.04)" : "#fcfcfc",
                    borderStyle: "dashed",
                    borderWidth: "2px",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => document.getElementById("cms-featured-img")?.click()}
                >
                  <input
                    id="cms-featured-img"
                    type="file"
                    accept="image/*"
                    className="hidden"
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
                        alt="Featured Preview"
                        className="max-h-32 rounded-lg object-cover mb-2 border border-gray-100"
                      />
                      <span className="text-[10px] text-gray-400 font-semibold">Drop or click to change featured image</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud size={24} className="text-[#FF6B00] mb-2" />
                      <span className="text-xs font-bold text-gray-600">Upload Featured Image</span>
                      <span className="text-[10px] text-gray-400">Click to browse or drop here</span>
                    </>
                  )}
                </div>
                <FormField label="Or Featured Image URL">
                  <input 
                    value={form.thumbnailUrl} 
                    onChange={(e) => setForm(f => ({ ...f, thumbnailUrl: e.target.value }))} 
                    placeholder="https://..." 
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl outline-none"
                  />
                </FormField>
              </div>

              {/* Taxonomy & Metadata */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Publish Settings</h3>
                
                <FormField label="Category">
                  <select 
                    value={form.category} 
                    onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl outline-none bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>

                <FormField label="Publish Date">
                  <input 
                    type="date"
                    value={form.date} 
                    onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} 
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl outline-none"
                  />
                </FormField>

                {/* Dynamic Tags Box */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      value={tagsInput} 
                      onChange={(e) => setTagsInput(e.target.value)} 
                      placeholder="Add tag (e.g. AI)" 
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                      className="w-full text-xs px-3 py-1.5 border border-gray-200 rounded-xl outline-none"
                    />
                    <button 
                      onClick={handleAddTag}
                      className="px-3 bg-gray-150 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {form.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-[#FF6B00] text-[11px] font-semibold"
                      >
                        #{tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600 text-[10px] ml-0.5"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {form.tags.length === 0 && <span className="text-xs text-gray-400 italic">No tags selected.</span>}
                  </div>
                </div>

                <FormField label="Excerpt Summary *">
                  <textarea 
                    value={form.excerpt} 
                    onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} 
                    placeholder="Short 2-sentence summary for card layouts..."
                    rows={4}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl outline-none resize-none font-sans"
                  />
                </FormField>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, item: null })} title="Delete CMS Post" size="sm">
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
          Delete the post <strong>"{deleteModal.item?.title}"</strong>? This will permanently remove it from the system and the website.
        </p>
        <div className="flex justify-end gap-3">
          <GhostBtn onClick={() => setDeleteModal({ open: false, item: null })}>Cancel</GhostBtn>
          <DangerBtn onClick={handleDeleteConfirm}>Delete CMS Post</DangerBtn>
        </div>
      </Modal>
    </div>
  );
}
