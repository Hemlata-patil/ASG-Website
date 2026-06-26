import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AAL from './pages/AAL';
import ASG from './pages/ASG';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Blogs from './pages/Blogs';
import Listings from './pages/Listings';

function AdminRedirect() {
  useEffect(() => {
    const origin = window.location.origin;
    if (origin.includes("5173")) {
      window.location.href = origin.replace("5173", "5174");
    } else {
      window.location.href = "http://localhost:5174";
    }
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aal" element={<AAL />} />
        <Route path="/asg" element={<ASG />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/listings/:type" element={<Listings />} />
        <Route path="/admin" element={<AdminRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

