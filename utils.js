const { createClient } = require('@supabase/supabase-js')
const moment = require("moment")
// not recommended. Just for test purpose. 
// Better have a .env file
const SUPABASE_URL = "https://roxbbbxlqouzumqfsstv.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJveGJiYnhscW91enVtcWZzc3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMwMDU1MTAsImV4cCI6MTk5ODU4MTUxMH0.rhEzoIV-9UB8me5RXag7mOsitHWLKSM53UHwk97YddQ"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// check if a username is available or not

async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
  if (error) {
    throw new Error(error.message)
  }

  // return data.length > 0
  // console.log(data[0].username)
  if (data.length > 0) {
    return data[0];
  } else {
    return false;

  }

}
async function findUserByUsernameAndPassword(username, password) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
  if (error) {
    throw new Error(error.message)
  }
  if (data.length === 0) {
    // throw new Error("Invalid login credentials")
    return null
  }
  return data[0]
}



// time ago function to change the timestamp into a human readable form
function timeAgo(timestamp) {
  return moment(timestamp).fromNow();
}

module.exports = { getUserByUsername, supabase, findUserByUsernameAndPassword, timeAgo }
