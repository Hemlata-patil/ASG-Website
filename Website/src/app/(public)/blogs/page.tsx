'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper/PageWrapper';
import SectionHeading from '@/components/common/SectionHeading/SectionHeading';
import { blogs as staticBlogs } from '@/data/blogs';

export default function Blogs() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tag = params.get('tag');
      if (tag) {
        setSelectedTag(tag);
      }
    }
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await fetch('/api/v1/blogs');
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setBlogsList(json.data);
            return;
          }
        }
      } catch (e) {
        console.error("Error fetching blogs from API:", e);
      }

      // Fallback to static blogs mapped to CMS structure
      const mapped = staticBlogs.map(b => ({
        id: b.id.toString(),
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
    };

    loadBlogs();
  }, []);

  // Filter categories dynamically from current blogsList plus 'All'
  const categories = ['All', ...Array.from(new Set(blogsList.map(b => b.category)))];

  // Filtering blogs based on category selection, tag selection, and search query
  const filteredBlogs = blogsList.filter(blog => {
    const matchCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchTag = !selectedTag || (blog.tags && blog.tags.includes(selectedTag));
    const matchSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.tags && blog.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchCategory && matchTag && matchSearch;
  });

  return (
    <PageWrapper>
      <section className="section">
        <div className="container">
          <SectionHeading
            overline="Insights & Ideas"
            title="Ecosystem Blogs & Articles"
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

            {/* Selected Tag Active Filter */}
            {selectedTag && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--apex-primary-tint)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                color: 'var(--apex-primary)',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginTop: '10px',
                border: '1px solid var(--apex-primary)'
              }}>
                Tag: #{selectedTag}
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    if (typeof window !== 'undefined') {
                      window.history.replaceState({}, '', window.location.pathname);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--apex-primary)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginLeft: '4px',
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            )}
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
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden', cursor: 'pointer', backgroundColor: 'var(--apex-bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => router.push(`/blogs/${blog.slug}`)}>
                  {blog.thumbnailUrl ? (
                    <img
                      src={blog.thumbnailUrl}
                      alt={blog.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-base)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--apex-text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>
                      <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                      <span>No Cover Image</span>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(255, 90, 20, 0.1)',
                    color: 'var(--apex-primary)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {blog.date}
                  </div>
                </div>

                {/* Article Info */}
                <div style={{ padding: 'var(--space-3) var(--space-3) var(--space-3)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4
                      className="heading-sm"
                      style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--apex-text-white)', cursor: 'pointer', lineHeight: '1.4', fontWeight: '700' }}
                      onClick={() => router.push(`/blogs/${blog.slug}`)}
                    >
                      {blog.title}
                    </h4>
                    <p className="body-sm" style={{ color: 'var(--apex-text-muted)', marginBottom: '12px', lineHeight: '1.6', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Blog Card Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {blog.tags.map((t: string) => (
                        <span
                          key={t}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTag(t);
                            if (typeof window !== 'undefined') {
                              window.history.replaceState({}, '', `?tag=${encodeURIComponent(t)}`);
                            }
                          }}
                          style={{
                            fontSize: '0.7rem',
                            color: selectedTag === t ? '#fff' : 'var(--apex-primary)',
                            backgroundColor: selectedTag === t ? 'var(--apex-primary)' : 'var(--apex-primary-tint)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedTag !== t) {
                              e.currentTarget.style.backgroundColor = 'var(--apex-primary)';
                              e.currentTarget.style.color = '#fff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedTag !== t) {
                              e.currentTarget.style.backgroundColor = 'var(--apex-primary-tint)';
                              e.currentTarget.style.color = 'var(--apex-primary)';
                            }
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
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
