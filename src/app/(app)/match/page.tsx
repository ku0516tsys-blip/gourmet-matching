import { createClient } from '@/lib/supabase/server'
import MatchClient from './MatchClient'

export default async function MatchPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', user?.id)
    .limit(10)

  return <MatchClient profiles={profiles || []} currentUserId={user?.id || ''} />
}
