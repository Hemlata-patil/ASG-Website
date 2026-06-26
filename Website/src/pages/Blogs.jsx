import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper/PageWrapper';
import SectionHeading from '../components/common/SectionHeading/SectionHeading';
import { blogs } from '../data/blogs';

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Ecosystem', 'Technology', 'Education'];

  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(b => b.category === selectedCategory);

  return (
    <PageWrapper>
      <section className="section">
        <div className="container">
          <SectionHeading 
            overline="Insights & Ideas"
            title="Ecosystem Logs & Articles"
            subtitle="Thoughts, tutorials, and success stories from the APEX Startup Group and AI Launchpad cohorts."
          />

          {/* Category Filters */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: 'var(--space-6)'
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
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={blog.cover} 
                    alt={blog.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Article Info */}
                <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
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

                    <h4 className="heading-sm" style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--apex-text-white)' }}>{blog.title}</h4>
                    <p className="body-sm" style={{ color: 'var(--apex-text-muted)', marginBottom: 'var(--space-4)', lineHeight: '1.6' }}>{blog.summary}</p>
                  </div>

                  <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderTop: '1px solid var(--apex-border-dark)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--apex-text-muted)' }}>{blog.date}</span>
                    <span style={{ color: 'var(--apex-primary)', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Read Article →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
