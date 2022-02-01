const supabaseClient=require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config()
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

module.exports = supabaseClient.createClient(supabaseUrl, supabaseAnonKey)