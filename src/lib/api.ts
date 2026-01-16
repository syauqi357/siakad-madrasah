// import { goto } from '$app/navigation';

const API_URL = import.meta.env.VITE_API_URL;

type FetchOptions = RequestInit & {
    headers?: Record<string, string>;
};

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
    const token = localStorage.getItem('token');
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    try {
        const response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Instead of goto, we can redirect via window.location to ensure a full reload and clear state
            // or let the component handle the redirect if needed.
            // But for security, clearing storage is key.
             if (typeof window !== 'undefined') {
                 window.location.href = '/login';
             }
            throw new Error('Unauthorized');
        }

        return response;
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}
