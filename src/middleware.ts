import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Prevent shared hosting / proxy cache (DomaiNesia, LiteSpeed, Nginx) from caching dynamic SSR pages & redirects
  const pathname = context.url.pathname;
  if (!pathname.startsWith('/_astro/') && !pathname.startsWith('/images/') && !pathname.startsWith('/fonts/')) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Accel-Expires', '0');
  }

  return response;
});
