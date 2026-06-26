import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { Menu, Bell, Search } from "lucide-react";

export default function AdminLayout() {
  const { isLoggedIn, adminEmail } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const initial = adminEmail?.[0]?.toUpperCase() || "A";

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f3f4f6", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar isOpen={false} onClose={() => {}} />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center gap-4 px-6 py-3.5 bg-white flex-shrink-0"
          style={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl"
            style={{ background: "#f4f4f5", border: "none", cursor: "pointer" }}
          >
            <Menu size={18} style={{ color: "#555" }} />
          </button>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl w-full"
              style={{
                background: "#f4f4f5",
                border: "1.5px solid transparent",
              }}
            >
              <Search size={15} style={{ color: "#aaa" }} />
              <input
                placeholder="Search…"
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  color: "#555",
                  width: "100%",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
          </div>

          <div className="flex-1" />

          {/* Notification + Avatar */}
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-xl transition-colors"
              style={{ background: "#f4f4f5", border: "none", cursor: "pointer" }}
            >
              <Bell size={17} style={{ color: "#8a8a8a" }} />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "#FF6B00" }}
              />
            </button>

            <div
              className="flex items-center gap-2.5 pl-3"
              style={{ borderLeft: "1px solid #f0f0f0" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#FF6B00" }}
              >
                <span
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#fff",
                  }}
                >
                  {initial}
                </span>
              </div>
              <div className="hidden md:block">
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0d0d0d",
                    lineHeight: 1.2,
                  }}
                >
                  {adminEmail || "Admin"}
                </div>
                <div style={{ fontSize: "11px", color: "#8a8a8a" }}>
                  Super Admin
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page outlet */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
