const API_URL = import.meta.env.PUBLIC_API_URL || "https://api.katalog.batik.gooproper.id/api";

export async function apiFetch<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  const isMultipart = options?.body instanceof FormData;
  if (isMultipart) {
    // If body is FormData, browser needs to set the boundary, so do NOT set Content-Type
    delete headers["Content-Type"];
  }

  const mergedHeaders = {
    ...headers,
    ...options?.headers,
  };

  const url = `${API_URL}/${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  const text = await res.text();

  if (!res.ok) {
    let message = `HTTP Error ${res.status}: ${res.statusText}`;
    try {
      const errBody = JSON.parse(text);
      if (errBody.message) message = errBody.message;
    } catch (e) {}
    throw new Error(message);
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("DEBUG: Server returned non-JSON response:", text.slice(0, 1000));
    throw new Error(`Respon server bukan JSON yang valid (kemungkinan HTML/Error Backend). Teks awal: ${text.slice(0, 150)}...`);
  }

  // Deep recursive loading for category types
  if (endpoint === "types") {
    const rawData = data?.data || data;
    if (Array.isArray(rawData)) {
      // 1. Identify Level 2 items that might contain children not returned in bulk API response
      const level2Items: any[] = [];
      for (const l1 of rawData) {
        if (l1.children && Array.isArray(l1.children)) {
          level2Items.push(...l1.children);
        }
      }

      // 2. Perform parallel recursive fetches to get their Level 3 children
      try {
        await Promise.all(level2Items.map(async (l2: any) => {
          // If backend omitted level 2 children, query them directly
          if (!l2.children || !Array.isArray(l2.children) || l2.children.length === 0) {
            try {
              // Avoid loop fetch by calling native fetch on target URL
              const subUrl = `${API_URL}/types/${l2.id}`;
              const subRes = await fetch(subUrl, { headers: mergedHeaders });
              if (subRes.ok) {
                const subJson = await subRes.json();
                const subData = subJson.data || subJson;
                if (subData && subData.children) {
                  l2.children = subData.children;
                }
              }
            } catch (fetchErr) {
              // Silently fail for nested children if single endpoint fails
            }
          }
        }));
      } catch (e) {
        // Global concurrency failure safe-catch
      }

      // 3. Standard recursive flattener
      const flatten = (items: any[]): any[] => {
        let flat: any[] = [];
        for (const item of items) {
          const { children, ...rest } = item;
          flat.push(rest);
          if (children && Array.isArray(children)) {
            flat = flat.concat(flatten(children));
          }
        }
        return flat;
      };
      
      const flatList = flatten(rawData);
      return (data?.data ? { ...data, data: flatList } : flatList) as T;
    }
  }

  return data;
}

export async function uploadToLaravel(file: File, folder?: string): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  if (folder) {
    formData.append("folder", folder);
  }

  const url = `${API_URL}/upload`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json"
    },
    body: formData,
  });

  const text = await res.text();

  if (!res.ok) {
    let message = `Upload gagal dengan status ${res.status}`;
    try {
      const errBody = JSON.parse(text);
      if (errBody.message) message = errBody.message;
    } catch (e) {}
    throw new Error(message);
  }

  let json: any;
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error("DEBUG: Upload endpoint returned non-JSON:", text.slice(0, 1000));
    throw new Error(`Upload gagal: Respon server bukan JSON. Teks awal: ${text.slice(0, 150)}...`);
  }

  return json.url; // Berasumsi Laravel mengembalikan { "url": "https://..." }
}
