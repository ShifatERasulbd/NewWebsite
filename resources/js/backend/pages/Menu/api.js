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

// --- Page API Endpoints ---
export async function fetchPages() {
    const payload = await requestJson('/api/pages');
    return Array.isArray(payload) ? payload : [];
}

export async function fetchPage(id) {
    return requestJson(`/api/pages/${id}`);
}

export async function createPage(data) {
    await ensureCsrfCookie();
    return requestJson('/api/pages', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updatePage(id, data) {
    await ensureCsrfCookie();
    return requestJson(`/api/pages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deletePage(id) {
    await ensureCsrfCookie();
    return requestJson(`/api/pages/${id}`, {
        method: 'DELETE',
    });
}

// --- Menu API Endpoints ---
export async function fetchMenus() {
    const payload = await requestJson('/api/menus');
    return Array.isArray(payload) ? payload : [];
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