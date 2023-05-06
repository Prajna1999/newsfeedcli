const { createClient } = require('@supabase/supabase-js')

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

getUserByUsername("Prajna1999")

async function upvotePost(postId, userId) {
  try {


    const { data: existingVote, error } = await supabase
      .from('postvote')
      .select('vote_type')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (error && error.message !== 'No single row found') {
      throw error;
    }

    if (existingVote) {
      if (existingVote.vote_type === 'UPVOTE') {
        return; // user has already upvoted
      }

      const { error } = await supabase
        .from('postvote')
        .update({ vote_type: 'UPVOTE' })
        .eq('post_id', postId)
        .eq('user_id', userId);
    } else {
      const { error } = await supabase.from('vote_type').insert([{ post_id: postId, user_id: userId, vote_type: 'UPVOTE' }]);
    }
  } catch (error) {
    console.error('Error upvoting post:', error.message);
  }
}

// upvotePost(6, 1)


async function upvotePost2(postId, userId) {
  try {
    if (!postId || !userId) {
      throw new Error('Invalid input: postId and userId are required');
    }

    const { data: existingVote } = await supabase
      .from('postvote')
      .select('vote_type')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === 'UPVOTE') {
        return; // user has already upvoted
      }

      await supabase.from('postvote').update('vote_type', { vote_type: 'UPVOTE' }).eq('post_id', postId).eq('user_id', userId);
    } else {
      await supabase.from('postvote').insert({ post_id: postId, user_id: userId, vote_type: 'UPVOTE' });
    }
  } catch (error) {
    console.error('Error upvoting post:', error.message);
  }
}

upvotePost2(2, 1)

module.exports = { getUserByUsername, supabase, findUserByUsernameAndPassword }
