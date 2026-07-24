import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Renova a sessão do Supabase a cada requisição e protege a área logada.
 *
 * IMPORTANTE: sempre retornar o `supabaseResponse` intacto. Recriar a resposta sem
 * copiar os cookies que o Supabase setou aqui dessincroniza o token entre navegador e
 * servidor e derruba o usuário de forma intermitente.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Não colocar lógica entre createServerClient e getUser: mantém o token fresco.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  // /auth/* (callback do OAuth, troca de código) roda antes de existir sessão.
  const isPublicRoute = isAuthPage || pathname.startsWith('/auth')

  // Sem usuário e fora das rotas públicas → manda para o login.
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Já logado tentando ver login/signup → manda para o app.
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
