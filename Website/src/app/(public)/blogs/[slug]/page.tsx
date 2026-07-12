import BlogDetail from './BlogDetail';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

export default async function BlogDetailPage({ params }) {
  const slug = params.slug;
  let blog = null;
  let relatedBlogs = [];

  try {
    const supabase = await createServerSupabase();

<<<<<<< HEAD
    const { data: blogData, error: blogError } = await supabase
      .from('blogs')
      .select('id, title, slug, category, excerpt, cover_image, body, published_at, created_at, updated_at')
      .eq('slug', slug)
      .eq('status', 'published')
      .limit(1)
      .single();

    if (!blogError && blogData) {
      blog = {
        ...blogData,
        coverImage: blogData.cover_image,
        body: blogData.body,
        publishedAt: blogData.published_at,
        author: 'ASG Editor',
      };

      const { data: related, error: relatedError } = await supabase
        .from('blogs')
        .select('id, title, slug, category, excerpt, cover_image, published_at')
        .eq('category', blogData.category)
        .neq('id', blogData.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (!relatedError && related) {
        relatedBlogs = related.map((post) => ({
          ...post,
          coverImage: post.cover_image,
          publishedAt: post.published_at,
          readTime: Math.ceil((post.excerpt?.split(' ').length || 0) / 200) + ' min read',
        }));
      }
    }
  } catch (error) {
    console.error('Error loading blog detail from Supabase:', error);
=======
  useEffect(() => {
    if (!slug) return;
    try {
      const raw = localStorage.getItem("asg_blogs");
      let allBlogs: any[] = [];
      if (raw) {
        allBlogs = JSON.parse(raw);
      } else {
        // Fallback mapping if not in localStorage
        allBlogs = staticBlogs.map(b => ({
          id: b.id,
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
      }

      // Find current blog by slug or id
      const current = allBlogs.find(b => b.slug === slug || String(b.id) === slug);
      if (current) {
        setBlog(current);

        // Find related blogs (same category, published, excluding current)
        const related = allBlogs
          .filter(b => b.id !== current.id && b.category === current.category && (b.status === "Published" || !b.status))
          .slice(0, 3);

        // If not enough related, fill with any other published blogs
        if (related.length < 3) {
          const others = allBlogs.filter(b => b.id !== current.id && !related.find(r => r.id === b.id) && (b.status === "Published" || !b.status));
          related.push(...others.slice(0, 3 - related.length));
        }

        setRelatedBlogs(related);
      } else {
        // Redirect to list if not found
        router.push('/blogs');
      }
    } catch (e) {
      console.error("Error loading blog details:", e);
      router.push('/blogs');
    }
  }, [slug, router]);

  if (!blog) {
    return (
      <PageWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--apex-text-white)' }}>
          Loading blog post...
        </div>
      </PageWrapper>
    );
>>>>>>> parent of 7a33bbd (Merge pull request #3 from Hemlata-patil/Aniket-Blogs-and-Contacts)
  }

  return <BlogDetail blog={blog} relatedBlogs={relatedBlogs} />;
}

              Read Time: <strong>{blog.readTime}</strong>
            </div>
          </div>

          {/* Featured Image Cover */}
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
              src={blog.thumbnailUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=420&fit=crop"}
              alt={blog.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
<<<<<<< HEAD
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
              src={blog.thumbnailUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=420&fit=crop"}
              alt={blog.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
=======
>>>>>>> parent of 7a33bbd (Merge pull request #3 from Hemlata-patil/Aniket-Blogs-and-Contacts)

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
                  <span key={t} style={{
                    fontSize: '0.75rem',
                    color: 'var(--apex-text-muted)',
                    backgroundColor: 'var(--apex-bg-surface-elevated)',
                    border: '1px solid var(--apex-border-dark)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600'
                  }}>
<<<<<<< HEAD
                  <span key={t} style={{
                    fontSize: '0.75rem',
                    color: 'var(--apex-text-muted)',
                    backgroundColor: 'var(--apex-bg-surface-elevated)',
                    border: '1px solid var(--apex-border-dark)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600'
                  }}>
=======
>>>>>>> parent of 7a33bbd (Merge pull request #3 from Hemlata-patil/Aniket-Blogs-and-Contacts)
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
