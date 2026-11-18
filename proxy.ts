import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  // PENTING: Jangan me-redirect request Server Action dari proxy/middleware.
  // Next.js Server Action memerlukan respons RSC stream atau header x-action-redirect.
  // Jika middleware me-redirect request Server Action (POST), browser menerima HTML 307
  // dan Next.js melempar error: "An unexpected response was received from the server".
  if (request.headers.has('next-action')) {
    const { getResponse } = await updateSession(request);
    return getResponse();
  }

  const { user, getResponse } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';

  // Proteksi route admin: belum login -> ke halaman login
  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Sudah login tapi membuka /admin atau /admin/login -> ke dashboard
  if (user && (isLoginPage || pathname === '/admin')) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return getResponse();
}

export const config = {
  matcher: ['/admin/:path*'],
};
