import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mdrqhrmmcjqutcmvqcvf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFocm1tY2pxdXRjbXZxY3ZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjExNzkzNSwiZXhwIjoyMDk3NjkzOTM1fQ.uXAFsrP8Umz5CWaEjzwLYB6Y0WEuTCRv4gHqwv0tAc4' // using service_role key to bypass RLS for inserts
const supabase = createClient(supabaseUrl, supabaseKey)

async function insertBlogs() {
  console.log("Fetching admin user...")
  const { data: admins, error: adminErr } = await supabase.from('admin_users').select('id').limit(1)
  
  if (adminErr || !admins || admins.length === 0) {
    console.error("Could not find an admin user. Can't insert blogs.", adminErr)
    return
  }

  const adminId = admins[0].id
  console.log("Found admin user:", adminId)

  const newBlogs = [
    {
      title: "Scaling Tech in Tier 2/3 Cities: The Jalgaon Blueprint", 
      slug: "scaling-tech-in-tier-2-3-cities-the-jalgaon-blueprint",
      category: "Ecosystem",
      admin_id: adminId,
      excerpt: "How grassroots communities are building high-performance tech squads and scaling regional startups from outside major metros.",
      content: "<p>Historically, building a high-growth technology startup required moving to tier-1 cities...</p>"
    },
    {
      title: "RAG & LLMs: Practical AI Engineering inside Launchpads", 
      slug: "rag-llms-practical-ai-engineering-inside-launchpads",
      category: "Technology",
      admin_id: adminId,
      excerpt: "A deep dive into model selections, prompt metrics, and structuring vector search directories for students building real projects.",
      content: "<p>Retrieval-Augmented Generation (RAG) has become the gold standard...</p>"
    },
    {
      title: "Bridging the Gap: Academic Curriculums vs Startup Operations", 
      slug: "bridging-the-gap-academic-curriculums-vs-startup-operations",
      category: "Education",
      admin_id: adminId,
      excerpt: "Why hands-on team structures and weekly expert reviews are essential to transition engineering students into production builders.",
      content: "<p>The traditional academic curriculum often leaves a gap...</p>"
    }
  ]

  console.log("Inserting new blogs...")
  const { data, error } = await supabase
    .from('blogs')
    .insert(newBlogs)
    .select()

  if (error) {
    console.error("Error inserting blogs:", error)
  } else {
    console.log("Successfully inserted", data.length, "blogs!")
  }
}

insertBlogs()
