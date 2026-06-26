import { createBrowserRouter } from "react-router";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardHome from "./pages/DashboardHome";
import EventsPage from "./pages/EventsPage";
import AALPage from "./pages/AALPage";
import GalleryPage from "./pages/GalleryPage";
import BlogsPage from "./pages/BlogsPage";
import CommunityPage from "./pages/CommunityPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import ContactQueriesPage from "./pages/ContactQueriesPage";
import AttendancePage from "./pages/AttendancePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "events", element: <EventsPage /> },
      { path: "aal", element: <AALPage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "blogs", element: <BlogsPage /> },
      { path: "community", element: <CommunityPage /> },
      { path: "queries", element: <ContactQueriesPage /> },
      { path: "attendance", element: <AttendancePage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);
