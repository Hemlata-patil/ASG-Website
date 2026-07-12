import BlogDetail from '../BlogDetail';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

export default async function BlogDetailPage({ params }) {
  const slug = params.slug;
  let blog = null;
  let relatedBlogs = [];

  try {
    const supabase = await createServerSupabase();

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
  }

  return <BlogDetail blog={blog} relatedBlogs={relatedBlogs} />;
}

