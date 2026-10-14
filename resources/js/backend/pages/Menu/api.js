async function ensureCsrfCookie() {
    await fetch('/sanctum/csrf-cookie', {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(options.headers || {}),
        },
        ...options,
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
        const message = payload?.message || 'Request failed';
        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}



// --- Menu API Endpoints ---
export async function fetchMenus() {
    const payload = await requestJson('/api/menus');
    return Array.isArray(payload) ? payload : [];
}

export async function reorderMenus(items) {
    await ensureCsrfCookie();
    return requestJson('/api/menus/reorder', {
        method: 'POST',
        body: JSON.stringify({ items }),
    });
}

export async function fetchMenu(id) {
    return requestJson(`/api/menus/${id}`);
}

export async function createMenu(data) {
    await ensureCsrfCookie();
    return requestJson('/api/menus', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateMenu(id, data) {
    await ensureCsrfCookie();
    return requestJson(`/api/menus/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteMenu(id) {
    await ensureCsrfCookie();
    return requestJson(`/api/menus/${id}`, {
        method: 'DELETE',
    });
}

export async function fetchMenuDesign(id) {
    return requestJson(`/api/menus/${id}/design`);
}

export async function saveMenuDesign(id, design) {
    await ensureCsrfCookie();
    return requestJson(`/api/menus/${id}/design`, {
        method: 'PUT',
        body: JSON.stringify({ design }),
    });
}

export async function uploadMenuLogo(menuId, file) {
  const body = new FormData();
  body.append('logo', file);

  const response = await fetch(`/api/menus/${menuId}/logo`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`, // use your real token source
    },
    body,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errors?.logo?.[0] || data.message || 'Upload failed.');
  }
  return data.url;
}