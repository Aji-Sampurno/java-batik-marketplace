import type { APIRoute } from 'astro';
import { getMaintenanceStatus, setMaintenanceStatus } from '../../lib/maintenance';

export const GET: APIRoute = async () => {
  const status = getMaintenanceStatus();
  return new Response(JSON.stringify({
    success: true,
    maintenance: status
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    }
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check authorization: admin cookie or admin password header/body
  const session = cookies.get('admin_session');
  const isAdminLoggedIn = session?.value === 'authenticated';
  const adminPassword = import.meta.env.ADMIN_PASSWORD || 'admin123';

  let body: any = {};
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }
  } else if (contentType.includes('form')) {
    try {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    } catch (e) {
      body = {};
    }
  }

  const authHeader = request.headers.get('x-admin-key') || body.admin_key || body.password;
  const isAuthorized = isAdminLoggedIn || authHeader === adminPassword;

  if (!isAuthorized) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Unauthorized. Hanya admin yang dapat mengubah status maintenance.'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Parse enabled boolean
  let enabled: boolean | undefined = undefined;
  if (typeof body.enabled === 'boolean') {
    enabled = body.enabled;
  } else if (typeof body.enabled === 'string') {
    enabled = body.enabled === 'true' || body.enabled === '1';
  }

  const updates: any = {};
  if (enabled !== undefined) updates.enabled = enabled;
  if (body.title && typeof body.title === 'string') updates.title = body.title.trim();
  if (body.message && typeof body.message === 'string') updates.message = body.message.trim();
  if (body.estimatedEndTime !== undefined) updates.estimatedEndTime = String(body.estimatedEndTime).trim();
  if (body.contactWhatsapp) updates.contactWhatsapp = String(body.contactWhatsapp).trim();
  updates.updatedBy = isAdminLoggedIn ? 'admin_dashboard' : 'api_token';

  const updatedConfig = setMaintenanceStatus(updates);

  return new Response(JSON.stringify({
    success: true,
    message: updatedConfig.enabled 
      ? 'Mode maintenance berhasil DIAKTIFKAN. Pengunjung akan melihat halaman pemeliharaan.' 
      : 'Mode maintenance berhasil DINONAKTIFKAN. Website normal kembali.',
    maintenance: updatedConfig
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    }
  });
};

