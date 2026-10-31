import { defineMiddleware } from 'astro:middleware';
import { getMaintenanceStatus, renderMaintenanceHtml } from './lib/maintenance';

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  // 1. Static assets whitelist - always served directly
  const isStatic =
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/favicon') ||
    /\.(css|js|png|jpg|jpeg|webp|svg|ico|woff|woff2|ttf|otf)$/i.test(pathname);

  if (isStatic) {
    return next();
  }

  // 2. Check Admin Session and Bypass parameters
  const isAdmin = context.cookies.get('admin_session')?.value === 'authenticated';
  const hasBypassParam = context.url.searchParams.get('bypass_maintenance') === 'batik123';
  const hasPreviewParam = context.url.searchParams.get('preview_maintenance') === '1';

  // Admin routes and maintenance API are always accessible
  const isAdminRoute =
    pathname === '/login' ||
    pathname.startsWith('/buka-toko') ||
    pathname === '/api/maintenance';

  // 3. Maintenance check
  const maintenance = getMaintenanceStatus();

  // If maintenance is enabled (and not an authorized admin/bypass) OR explicitly previewing:
  if ((maintenance.enabled && !isAdmin && !hasBypassParam && !isAdminRoute) || hasPreviewParam) {
    // If request targets API endpoints, return JSON 503
    if (pathname.startsWith('/api/')) {
      return new Response(
        JSON.stringify({
          success: false,
          maintenance: true,
          title: maintenance.title,
          message: maintenance.message,
          estimatedEndTime: maintenance.estimatedEndTime || null,
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '3600',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'X-Accel-Expires': '0',
          },
        }
      );
    }

    // Return custom HTML maintenance page with HTTP 200 (avoid LiteSpeed 503 fallback to directory index)
    const html = renderMaintenanceHtml(maintenance);
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'X-LiteSpeed-Cache-Control': 'no-cache',
        'X-Accel-Expires': '0',
      },
    });
  }

  // 4. Normal request flow
  const response = await next();

  // Prevent shared hosting / proxy cache (DomaiNesia, LiteSpeed, Nginx) from caching dynamic SSR pages & redirects
  response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('X-Accel-Expires', '0');
  response.headers.set('X-LiteSpeed-Cache-Control', 'no-cache');

  return response;
});
