import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  let user = null;
  try {
    const res = await supabase.auth.getUser();
    user = res.data?.user;
  } catch {
    user = null;
  }

  const demoCookie = request.cookies.get('lander_demo_user');
  const isAuthenticated = Boolean(user || demoCookie);
  const { pathname } = request.nextUrl;

  // Public routes — never redirect unauthenticated, redirect authenticated to /dashboard
  const publicRoutes = ['/login', '/auth/callback'];
  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    if (isAuthenticated) return NextResponse.redirect(new URL('/dashboard', request.url));
    return response;
  }

  // Protected routes — require auth
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }


  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
