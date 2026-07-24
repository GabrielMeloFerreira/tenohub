import type { NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  /*
   * Roda em tudo exceto assets estáticos e imagens. Ajuste a lista se adicionar
   * outros arquivos públicos que não precisam passar pela renovação de sessão.
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
