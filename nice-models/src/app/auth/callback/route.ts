import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Kreiraj profil ako ne postoji (za email confirmation flow)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!existingProfile) {
        // Kreiraj profil sa podacima iz metadata
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0],
            email: data.user.email,
            role: data.user.user_metadata?.role || 'user',
            profile_status: 'pending',
          })

        if (profileError) {
          console.error('Profile creation error in callback:', profileError)
        }
      }

      // Redirect based on role
      const role = data.user.user_metadata?.role || 'user'
      if (role === 'model') {
        return NextResponse.redirect(new URL('/register/model', requestUrl.origin))
      }
      
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login?error=auth_callback_error', requestUrl.origin))
}

