"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/admin/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarDays,
  Clock,
  Images,
  FileText,
  GraduationCap,
  Lightbulb,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatusBadge } from "@/components/admin/StatusBadge";

const STATS = [
  { label: "Total Events", value: "48", icon: CalendarDays, color: "#FF6B00", bg: "rgba(255,107,0,0.1)", delta: "+4 this month" },
  { label: "Upcoming Events", value: "12", icon: Clock, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", delta: "+2 this week" },
  { label: "Gallery Photos", value: "234", icon: Images, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", delta: "+18 this month" },
  { label: "Blog Posts", value: "67", icon: FileText, color: "#10b981", bg: "rgba(16,185,129,0.1)", delta: "+5 this month" },
  { label: "AAL Interns", value: "28", icon: GraduationCap, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", delta: "Active cohort" },
  { label: "Problem Statements", value: "15", icon: Lightbulb, color: "#06b6d4", bg: "rgba(6,182,212,0.1)", delta: "In progress" },
  { label: "Community Members", value: "1,240", icon: Users, color: "#ec4899", bg: "rgba(236,72,153,0.1)", delta: "+87 this month" },
];


const RECENT_BLOGS = [
  { title: "The Future of AI in India", author: "Priya Singh", date: "Feb 14, 2025", status: "Published" },
  { title: "Building Scalable Startups", author: "Rohan Mehta", date: "Feb 10, 2025", status: "Published" },
  { title: "Open Source Culture", author: "Aarav Patel", date: "Jan 28, 2025", status: "Draft" },
];

const COLLEGE_DATA = [
  { name: "GCOEJ", students: 12 },
  { name: "SSBT COET", students: 8 },
  { name: "KCES COE", students: 5 },
  { name: "GF COE", students: 3 },
  { name: "M. J. College", students: 4 },
  { name: "IMR College", students: 6 },
  { name: "Others", students: 2 },
];

export default function DashboardHome() {
  const { adminEmail } = useAuth();
  const firstName = adminEmail?.split("@")[0] || "Admin";
  const router = useRouter();

  const supabase = createClient();

  const [collegeData, setCollegeData] = useState<
    { name: string; students: number }[]
  >([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [totalEvents, setTotalEvents] = useState<number | string>("...");
  // 1. Added state to hold the count of upcoming events
  const [upcomingEvents, setUpcomingEvents] = useState<number | string>("...");
  // Added state to hold the count of total gallery photos
  const [totalGalleryPhotos, setTotalGalleryPhotos] = useState<number | string>("...");
  // 5. Added state to hold the count of total blog posts
  const [totalBlogs, setTotalBlogs] = useState<number | string>("...");
  // 9. Added state to hold the count of total interns
  const [totalInterns, setTotalInterns] = useState<number | string>("...");
  // 13. Added state to hold the count of total problem statements
  const [totalProblemStatements, setTotalProblemStatements] = useState<number | string>("...");
  // 17. Added state to hold the count of total community members
  const [totalCommunityMembers, setTotalCommunityMembers] = useState<number | string>("...");

  useEffect(() => {
    fetchChartData();
    fetchRecentEvents();
    fetchTotalEvents();
    fetchUpcomingEvents(); // 2. Call the fetch function when dashboard loads
    fetchTotalGalleryPhotos(); // Call the gallery photos fetch function
    fetchTotalBlogs(); // 6. Call the blog posts fetch function on load
    fetchTotalInterns(); // 10. Call the interns fetch function on load
    fetchTotalProblemStatements(); // 14. Call the problem statements fetch function on load
    fetchTotalCommunityMembers(); // 18. Call the community members fetch function on load
  }, []);

  // 19. Created function to fetch the exact count of community members from Supabase
  async function fetchTotalCommunityMembers() {
    const { count, error } = await supabase
      .from("community_members")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching community members:", error);
      return;
    }
    setTotalCommunityMembers(count ?? 0);
  }

  // 15. Created function to fetch the exact count of problem statements from Supabase
  async function fetchTotalProblemStatements() {
    const { count, error } = await supabase
      .from("problem_statements")
      .select("*", { count: "exact", head: true })
      .eq("status", "open"); // Added filter to only count open/in-progress problem statements

    if (error) {
      console.error("Error fetching problem statements:", error);
      return;
    }
    setTotalProblemStatements(count ?? 0);
  }

  // 11. Created function to fetch the exact count of interns from Supabase
  async function fetchTotalInterns() {
    const { count, error } = await supabase
      .from("interns")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching interns:", error);
      return;
    }
    setTotalInterns(count ?? 0);
  }

  // 7. Created function to fetch the exact count of blogs from Supabase
  async function fetchTotalBlogs() {
    const { count, error } = await supabase
      .from("blogs")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching blogs:", error);
      return;
    }
    setTotalBlogs(count ?? 0);
  }

  // Created function to fetch the total count of gallery photos from Supabase
  async function fetchTotalGalleryPhotos() {
    const { count, error } = await supabase
      .from("gallery_photos")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching gallery photos:", error);
      return;
    }
    setTotalGalleryPhotos(count ?? 0);
  }

  // 3. Created function to fetch the exact count of "upcoming" events from Supabase
  async function fetchUpcomingEvents() {
    const { count, error } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "upcoming");

    if (error) {
      console.error("Error fetching upcoming events:", error);
      return;
    }
    setUpcomingEvents(count ?? 0);
  }

  async function fetchTotalEvents() {
    const { count, error } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching total events:", error);
      return;
    }
    setTotalEvents(count ?? 0);
  }

  async function fetchRecentEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching recent events:", error);
      return;
    }
    setRecentEvents(data || []);
  }

  async function fetchChartData() {
    const { data, error } = await supabase
      .from("interns")
      .select("college");

    if (error) {
      console.error(error);
      return;
    }

    const nameMapping: Record<string, string> = {
      "Government Polytechnic Jalgaon": "GCOEJ",
      "Government Polytechnic": "GCOEJ",
      "GCOEJ": "GCOEJ",
      
      "SSBT College of Engineering and Technology": "SSBT COET",
      "SSBT COET": "SSBT COET",
      
      "KCE's College of Engineering": "KCES COE",
      "KCES": "KCES COE",
      "KCES COE": "KCES COE",
      
      "Godavari Foundation's College of Engineering": "GF COE",
      "GF COE": "GF COE",
      
      "M. J. College": "M. J. College",
      "IMR College": "IMR College",
      
      "B. Tech Comp Engineering": "Others" // Map specific unknowns to Others if desired, or let the fallback handle it
    };

    const counts: Record<string, number> = {
      "GCOEJ": 0,
      "SSBT COET": 0,
      "KCES COE": 0,
      "GF COE": 0,
      "M. J. College": 0,
      "IMR College": 0,
      "Others": 0
    };

    data?.forEach((item) => {
      const rawCollege = item.college?.trim();
      if (!rawCollege) {
        counts["Others"] += 1;
        return;
      }
      
      const mapped = nameMapping[rawCollege];
      if (mapped) {
        counts[mapped] += 1;
      } else {
        counts["Others"] += 1;
      }
    });

    setCollegeData(
      Object.entries(counts).map(([name, students]) => ({
        name,
        students,
      }))
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-7">
        <h1
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            color: "#0d0d0d",
            letterSpacing: "-0.3px",
            marginBottom: "4px",
          }}
        >
          Good morning, {firstName} 👋
        </h1>
        <p style={{ color: "#8a8a8a", fontSize: "14px" }}>
          Here's what's happening with ASG today.
        </p>
      </div>

      {/* Stat cards */}
      <div
        className="grid gap-4 mb-8"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {STATS.map((s) => (
          <StatCard 
            key={s.label} 
            {...s} 
            // 4. Update the mapped value dynamically based on the label, preserving other cards
            value={
              s.label === "Total Events" ? totalEvents.toString() : 
              s.label === "Upcoming Events" ? upcomingEvents.toString() : 
              s.label === "Gallery Photos" ? totalGalleryPhotos.toString() : // Dynamically substitute the total gallery photos
              s.label === "Blog Posts" ? totalBlogs.toString() : // 8. Dynamically substitute the total blog posts
              s.label === "AAL Interns" ? totalInterns.toString() : // 12. Dynamically substitute the total interns
              s.label === "Problem Statements" ? totalProblemStatements.toString() : // 16. Dynamically substitute the total problem statements
              s.label === "Community Members" ? totalCommunityMembers.toString() : // 20. Dynamically substitute the total community members
              s.value
            } 
          />
        ))}
      </div>

      {/* College Students Distribution Chart */}
      <div
        className="bg-white rounded-2xl p-6 mb-6"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}
      >
        <h2
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 700,
            fontSize: "16px",
            color: "#0d0d0d",
            marginBottom: "18px",
          }}
        >
          Students Distribution by Engineering & Local Colleges in Jalgaon
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={collegeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8a8a8a" }} />
            <YAxis tick={{ fontSize: 11, fill: "#8a8a8a" }} />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #f0f0f0",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }}
            />
            <Bar dataKey="students" fill="#FF6B00" radius={[8, 8, 0, 0]} maxBarSize={60} minPointSize={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Recent Events */}
        <div
          className="bg-white rounded-2xl p-6"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "#0d0d0d",
              }}
            >
              Recent Events
            </h2>
            <div 
              onClick={() => router.push("/dashboard/events")}
              className="flex items-center gap-1" 
              style={{ color: "#FF6B00", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
            >
              View all <ArrowUpRight size={14} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                  {["Event", "Date", "Venue", "Status"].map((h) => (
                    <th
                       key={h}
                       style={{
                         textAlign: "left",
                         fontSize: "11px",
                         fontWeight: 600,
                         color: "#aaa",
                         textTransform: "uppercase",
                         letterSpacing: "0.05em",
                         paddingBottom: "10px",
                         paddingRight: "16px",
                       }}
                     >
                       {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((ev, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: i < recentEvents.length - 1 ? "1px solid #f8f8f8" : "none" }}
                  >
                    <td style={{ padding: "12px 16px 12px 0", fontSize: "13.5px", fontWeight: 500, color: "#0d0d0d" }}>
                      {ev.title}
                    </td>
                    <td style={{ padding: "12px 16px 12px 0", fontSize: "13px", color: "#8a8a8a" }}>
                      {new Date(ev.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 16px 12px 0", fontSize: "13px", color: "#8a8a8a" }}>{ev.location}</td>
                    <td style={{ padding: "12px 0" }}>
                      <StatusBadge status={ev.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Blogs */}
        <div
          className="bg-white rounded-2xl p-6"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "#0d0d0d",
              }}
            >
              Recent Blogs
            </h2>
            <div 
              onClick={() => router.push("/dashboard/blogs")}
              className="flex items-center gap-1" 
              style={{ color: "#FF6B00", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
            >
              View all <ArrowUpRight size={14} />
            </div>
          </div>
          <div className="space-y-4">
            {RECENT_BLOGS.map((b, i) => (
              <div
                key={i}
                className="p-4 rounded-xl"
                style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#0d0d0d",
                      lineHeight: 1.3,
                    }}
                  >
                    {b.title}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  {b.author} · {b.date}
                </div>
              </div>
            ))}
          </div>

          {/* Quick activity summary */}
          <div
            className="mt-5 p-4 rounded-xl flex items-center gap-3"
            style={{ background: "rgba(255,107,0,0.06)", border: "1px solid rgba(255,107,0,0.15)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,107,0,0.15)" }}
            >
              <TrendingUp size={16} style={{ color: "#FF6B00" }} />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#0d0d0d" }}>+23% growth</div>
              <div style={{ fontSize: "11px", color: "#8a8a8a" }}>Community grew this month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  delta,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  color: string;
  bg: string;
  delta: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: bg }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <span
          style={{
            fontSize: "11px",
            color: "#10b981",
            fontWeight: 500,
            background: "rgba(16,185,129,0.08)",
            padding: "2px 8px",
            borderRadius: "99px",
          }}
        >
          ↑
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Satoshi', sans-serif",
          fontWeight: 700,
          fontSize: "28px",
          color: "#0d0d0d",
          lineHeight: 1,
          marginBottom: "4px",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "13px", fontWeight: 500, color: "#555", marginBottom: "2px" }}>{label}</div>
      <div style={{ fontSize: "11px", color: "#aaa" }}>{delta}</div>
    </div>
  );
}

