import pg from 'pg'

const { Client } = pg
const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres.mdrqhrmmcjqutcmvqcvf:gqBICGwE9B4mKTMS@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres"
})

async function fixRLS() {
  await client.connect()
  try {
    console.log("Adding RLS SELECT policy to problem_statements...")
    await client.query(`
      CREATE POLICY "Allow public read access" ON public.problem_statements FOR SELECT USING (true);
    `)
    console.log("Success!")
  } catch(e) {
    console.error(e.message)
  }

  try {
    console.log("Adding RLS SELECT policy to community_members...")
    await client.query(`
      CREATE POLICY "Allow public read access" ON public.community_members FOR SELECT USING (true);
    `)
    console.log("Success!")
  } catch(e) {
    console.error(e.message)
  }

  await client.end()
}

fixRLS()
