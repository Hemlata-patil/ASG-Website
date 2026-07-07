'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '../../components/layout/PageWrapper/PageWrapper';
import SectionHeading from '../../components/common/SectionHeading/SectionHeading';
import { blogs as staticBlogs } from '../../data/blogs';

export default function Blogs() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogsList, setBlogsList] = useState<any[]>([]);

  // Load blogs from localStorage or fallback
  useEffect(() => {
    try {
      const raw = localStorage.getItem("asg_blogs");
      if (raw) {
        const parsed = JSON.parse(raw);
        const published = parsed.filter((b: any) => b.status === "Published");
        if (published.length > 0) {
          setBlogsList(published);
          return;
        }
      }
    } catch (e) {
      console.error("Error reading blogs from localStorage:", e);
    }

    // Fallback to static blogs mapped to CMS structure
    const mapped = staticBlogs.map(b => ({
      id: b.id,
      title: b.title,
      slug: b.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"),
      author: "ASG Editor",
      category: b.category,
      status: "Published",
      date: b.date,
      excerpt: b.summary,
      content: `<p>${b.summary}</p>`,
      readTime: b.readTime,
      thumbnailUrl: b.cover,
      tags: [b.category]
    }));
    setBlogsList(mapped);
  }, []);

  // Filter categories dynamically from current blogsList plus 'All'
  const categories = ['All', ...Array.from(new Set(blogsList.map(b => b.category)))];

  // Filtering blogs based on category selection and search query
  const filteredBlogs = blogsList.filter(blog => {
    const matchCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <PageWrapper>
      <section className="section">
        <div className="container">
          <SectionHeading 
            overline="Insights & Ideas"
            title="Ecosystem Logs & Articles"
            subtitle="Thoughts, tutorials, and success stories from the APEX Startup Group and AI Launchpad cohorts."
          />

          {/* Search Bar & Category Filters wrapper */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            marginBottom: 'var(--space-8)'
          }}>
            {/* Search Input */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '450px',
            }}>
              <input 
                type="text" 
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--apex-border-dark)',
                  backgroundColor: 'var(--apex-bg-surface-elevated)',
                  color: 'var(--apex-text-white)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>

            {/* Category Filters */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    backgroundColor: selectedCategory === cat ? 'var(--apex-primary)' : 'var(--apex-bg-surface-elevated)',
                    color: selectedCategory === cat ? '#fff' : 'var(--apex-text-white)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 18px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-4)'
          }} className="grid-3">
            {filteredBlogs.map((blog) => (
              <article 
                key={blog.id} 
                style={{
                  backgroundColor: 'var(--apex-bg-surface)',
                  border: '1px solid var(--apex-border-dark)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all var(--transition-base)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* Image Cover */}
                <div style={{ height: '200px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => router.push(`/blogs/${blog.slug}`)}>
                  <img 
                    src={blog.thumbnailUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"} 
                    alt={blog.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Article Info */}
                <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--apex-primary)',
                        backgroundColor: 'var(--apex-primary-tint)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: '700'
                      }}>{blog.category}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--apex-text-muted)' }}>{blog.readTime}</span>
                    </div>

                    <h4 
                      className="heading-sm" 
                      style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--apex-text-white)', cursor: 'pointer' }}
                      onClick={() => router.push(`/blogs/${blog.slug}`)}
                    >
                      {blog.title}
                    </h4>
                    <p className="body-sm" style={{ color: 'var(--apex-text-muted)', marginBottom: 'var(--space-4)', lineHeight: '1.6', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {blog.excerpt}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--apex-border-dark)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--apex-text-muted)' }}>
                      {new Date(blog.date).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span 
                      style={{ color: 'var(--apex-primary)', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}
                      onClick={() => router.push(`/blogs/${blog.slug}`)}
                    >
                      Read Article →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--apex-text-muted)', padding: '40px 0' }}>
              No blogs found matching selection.
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
