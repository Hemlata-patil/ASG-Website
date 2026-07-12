import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mdrqhrmmcjqutcmvqcvf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFocm1tY2pxdXRjbXZxY3ZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjExNzkzNSwiZXhwIjoyMDk3NjkzOTM1fQ.uXAFsrP8Umz5CWaEjzwLYB6Y0WEuTCRv4gHqwv0tAc4' // using service_role key to bypass RLS for inserts
const supabase = createClient(supabaseUrl, supabaseKey)

const newEvents = [
  {
    title: "Monthly Meetups (22 Cohorts Completed)",
    type: "Meetup",
    start_date: "2026-06-15T10:00:00+00:00",
    location: "IMR Seminar Hall / Jalgaon HQ",
    status: "past",
    description: "Our flagship monthly gathering bringing together startup founders, tech experts, and developers.",
    tags: ["#Meetup", "#Community", "#Networking", "#22Cohorts"],
    slug: "monthly-meetups-22-cohorts-12345",
    cover_image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400&auto=format&fit=crop"
  },
  {
    title: "Breakfast with Brilliance: Morning Founder Networking",
    type: "Founder Circle",
    start_date: "2026-06-20T08:00:00+00:00",
    location: "Hotel President Cottage, Jalgaon",
    status: "past",
    description: "Interactive morning coffee meetups with leading industry veterans and domain experts to exchange growth strategies.",
    tags: ["#FounderCircle", "#Mentorship", "#Breakfast"],
    slug: "breakfast-with-brilliance-12346",
    cover_image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400&auto=format&fit=crop"
  },
  {
    title: "Pickel Ball Meetup (1 Cohort)",
    type: "Community",
    start_date: "2026-08-10T16:00:00+00:00",
    location: "Jalgaon Sports Arena",
    status: "upcoming",
    description: "A fun fitness-focused networking event where community founders, developers, and designers hang out over pickleball.",
    tags: ["#Pickleball", "#Community", "#Sports"],
    slug: "pickel-ball-meetup-12347",
    cover_image_url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop"
  },
  {
    title: "Web3 & Blockchain Demystified",
    type: "Workshop",
    start_date: "2026-09-05T14:00:00+00:00",
    location: "SSBT COET Incubation Center",
    status: "upcoming",
    description: "A hands-on workshop covering the fundamentals of Web3, Smart Contracts, and how to build your first DApp.",
    tags: ["#Web3", "#Blockchain", "#Workshop", "#Tech"],
    slug: "web3-blockchain-demystified-12348",
    cover_image_url: "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=400&auto=format&fit=crop"
  }
]

async function insertEvents() {
  console.log("Inserting new events...")
  const { data, error } = await supabase
    .from('events')
    .insert(newEvents)
    .select()

  if (error) {
    console.error("Error inserting events:", error)
  } else {
    console.log("Successfully inserted", data.length, "events!")
  }
}

insertEvents()
