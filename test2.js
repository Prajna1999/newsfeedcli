const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = "https://roxbbbxlqouzumqfsstv.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJveGJiYnhscW91enVtcWZzc3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMwMDU1MTAsImV4cCI6MTk5ODU4MTUxMH0.rhEzoIV-9UB8me5RXag7mOsitHWLKSM53UHwk97YddQ"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)


async function getUsers() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) {
    console.log(error)
    return
  }
  console.log(data)
}


getUsers()