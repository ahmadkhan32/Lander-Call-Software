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

  // 1. Immediately pass all Next.js internals, static files, and asset requests
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/brand') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/.well-known') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Public auth and status routes — never require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/accept-invitation',
    '/unauthorized',
    '/auth/callback',
  ];

  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isPublic) {
    if (isAuthenticated && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // 3. Protected workspace routes — require authentication
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next/static (static files)
     * 2. /_next/image (image optimization files)
     * 3. /favicon.ico (favicon file)
     * 4. Static assets with extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico, .css, .js, .map)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf)$).*)',
  ],
};
