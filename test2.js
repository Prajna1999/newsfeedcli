


async function getUsers() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) {
    console.log(error)
    return
  }
  console.log(data)
}


getUsers()