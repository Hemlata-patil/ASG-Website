import BlogsList from './BlogsList';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

export default async function BlogsPage() {
  let blogPosts = [];

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, category, excerpt, cover_image, published_at, created_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (!error && data) {
      blogPosts = data.map((post) => ({
        ...post,
        coverImage: post.cover_image,
        publishedAt: post.published_at,
        readTime: Math.ceil((post.excerpt?.split(' ').length || 0) / 200) + ' min read',
      }));
    }
  } catch (error) {
    console.error('Error loading blogs from Supabase:', error);
  }

  return <BlogsList posts={blogPosts} />;
}
