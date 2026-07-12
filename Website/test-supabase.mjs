import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mdrqhrmmcjqutcmvqcvf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFocm1tY2pxdXRjbXZxY3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTc5MzUsImV4cCI6MjA5NzY5MzkzNX0.kMk7VW3zK4GTY8JOaq3s0dHdvSH7CeUtaAGPTzJb7aU'
)

async function test() {
  console.log("Fetching from events table...")
  const { data, error } = await supabase.from('events').select('*')
  console.log("Data:", data)
  console.log("Error:", error)
}

test()
