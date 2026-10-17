const getXsrfToken = () => {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
};

export async function logoutCurrentUser() {
    const csrfResponse = await fetch('/sanctum/csrf-cookie', {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    if (!csrfResponse.ok) {
        throw new Error(`Unable to initialize logout (${csrfResponse.status})`);
    }

    const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
    });

    if (!response.ok && response.status !== 401) {
        throw new Error(`Logout failed (${response.status})`);
    }
}
