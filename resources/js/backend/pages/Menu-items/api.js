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

export async function fetchMenuItems(menuId = null) {
    const url = menuId ? `/api/menu-items?menu_id=${menuId}` : '/api/menu-items';
    const payload = await requestJson(url);
    return Array.isArray(payload) ? payload : [];
}

export async function fetchMenuItem(id) {
    return requestJson(`/api/menu-items/${id}`);
}

export async function createMenuItem(data) {
    await ensureCsrfCookie();
    return requestJson('/api/menu-items', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateMenuItem(id, data) {
    await ensureCsrfCookie();
    return requestJson(`/api/menu-items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteMenuItem(id) {
    await ensureCsrfCookie();
    return requestJson(`/api/menu-items/${id}`, {
        method: 'DELETE',
    });
}

export async function reorderMenuItems(items) {
    await ensureCsrfCookie();
    return requestJson('/api/menu-items/reorder', {
        method: 'POST',
        body: JSON.stringify({ items }),
    });
}