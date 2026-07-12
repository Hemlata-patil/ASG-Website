import BlogDetail from './BlogDetail';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

export default async function BlogDetailPage({ params }) {
  const slug = params.slug;
  let blog = null;
  let relatedBlogs = [];

  try {
    const supabase = await createServerSupabase();


  useEffect(() => {
    if (!slug) return;
    const loadBlogData = async () => {
      try {
        // Fetch current blog
        const res = await fetch(`/api/v1/blogs/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setBlog(json.data);

            // Fetch other blogs for related list
            const listRes = await fetch('/api/v1/blogs');
            if (listRes.ok) {
              const listJson = await listRes.json();
              const allBlogs = listJson.data || [];
              const related = allBlogs
                .filter((b: any) => b.id !== json.data.id && b.category === json.data.category)
                .slice(0, 3);
              
              if (related.length < 3) {
                const others = allBlogs.filter((b: any) => b.id !== json.data.id && !related.find((r: any) => r.id === b.id));
                related.push(...others.slice(0, 3 - related.length));
              }
              setRelatedBlogs(related);
            }
            return;
          }
        }
      } catch (e) {
        console.error("Error loading blog details from API:", e);
      }

      // Fallback mapping if not in database
      const allStaticBlogsMapped = staticBlogs.map(b => ({
        id: b.id.toString(),
        title: b.title,
        slug: b.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"),
        author: "ASG Editor",
        category: b.category,
        status: "Published",
        date: b.date,
        excerpt: b.summary,
        content: `
          <h2>${b.title}</h2>
          <p>${b.summary}</p>
          <p>Full content of this post is managed inside the Admin CMS. Please publish content from the dashboard to render custom rich HTML formatting.</p>
        `,
        readTime: b.readTime,
        thumbnailUrl: b.cover,
        tags: [b.category]
      }));

      const current = allStaticBlogsMapped.find(b => b.slug === slug || String(b.id) === slug);
      if (current) {
        setBlog(current);
        const related = allStaticBlogsMapped
          .filter(b => b.id !== current.id && b.category === current.category)
          .slice(0, 3);

        if (related.length < 3) {
          const others = allStaticBlogsMapped.filter(b => b.id !== current.id && !related.find(r => r.id === b.id));
          related.push(...others.slice(0, 3 - related.length));
        }
        setRelatedBlogs(related);
      } else {
        router.push('/blogs');
      }
    };

    loadBlogData();
  }, [slug, router]);

  useEffect(() => {
    if (!blog) return;
    if (typeof window !== 'undefined') {
      document.title = blog.metaTitle || `${blog.title} - APEX Startup Group`;
      
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', blog.metaDescription || blog.excerpt || '');

      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute('content', blog.keywords || (blog.tags ? blog.tags.join(', ') : ''));
    }
  }, [blog]);

  if (!blog) {
    return (
      <PageWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--apex-text-white)' }}>
          Loading blog post...
        </div>
      </PageWrapper>
    );

  }

  return <BlogDetail blog={blog} relatedBlogs={relatedBlogs} />;
}

              Read Time: <strong>{blog.readTime}</strong>
            </div>
          </div>

          {/* Featured Image Cover */}
          {blog.thumbnailUrl && (
            <div style={{
              width: '100%',
              height: '420px',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              marginBottom: 'var(--space-6)',
              border: '1px solid var(--apex-border-dark)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Dynamic Article Content */}
          <div
            className="rich-blog-content"
            style={{ marginBottom: 'var(--space-8)' }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tag Cloud */}
          {blog.tags && blog.tags.length > 0 && (
            <div style={{
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--apex-border-dark)',
              marginBottom: 'var(--space-8)'
            }}>
              <h5 style={{ color: 'var(--apex-text-white)', fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase' }}>Tags</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {blog.tags.map((t: string) => (
                  <span
                    key={t}
                    onClick={() => router.push(`/blogs?tag=${encodeURIComponent(t)}`)}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--apex-primary)',
                      backgroundColor: 'var(--apex-primary-tint)',
                      border: '1px solid rgba(253, 91, 35, 0.25)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--apex-primary)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--apex-primary-tint)';
                      e.currentTarget.style.color = 'var(--apex-primary)';
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Blogs Section */}
          {relatedBlogs.length > 0 && (
            <div style={{
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--apex-border-dark)',
            }}>
              <h3 className="heading-md" style={{ color: 'var(--apex-text-white)', marginBottom: 'var(--space-4)' }}>Related Articles</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-4)'
              }} className="grid-3">
                {relatedBlogs.map(item => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'var(--apex-bg-surface)',
                      border: '1px solid var(--apex-border-dark)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform var(--transition-base)'
                    }}
                    onClick={() => {
                      router.push(`/blogs/${item.slug}`);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                  >
                    <div style={{ height: '130px', overflow: 'hidden' }}>
                      <img
                        src={item.thumbnailUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=150&fit=crop"}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <h5 style={{ color: 'var(--apex-text-white)', fontSize: '0.95rem', fontWeight: '600', marginBottom: '8px', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.title}
                      </h5>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--apex-text-muted)', borderTop: '1px solid var(--apex-border-dark)', paddingTop: '8px' }}>
                        <span>{item.readTime}</span>
                        <span>{new Date(item.date).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </PageWrapper>
  );
}
