import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // "/" 대신에 사용자가 있던 원래 페이지로 돌아갈 수도 있지만, 지금은 기본 홈으로
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 로그인 실패 시 (추후 에러 페이지로 유도 가능)
  return NextResponse.redirect(`${origin}/login?error=auth-failed`)
}
