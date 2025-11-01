import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { router } from '@inertiajs/react';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Set up CSRF token for Inertia requests
router.on('before', (event) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken && event.detail.visit.method !== 'get') {
        // Ensure headers object exists
        if (!event.detail.visit.headers) {
            event.detail.visit.headers = {};
        }
        
        // Always set X-CSRF-TOKEN header
        event.detail.visit.headers['X-CSRF-TOKEN'] = csrfToken;
        event.detail.visit.headers['X-Requested-With'] = 'XMLHttpRequest';
        
        // If using FormData, also add token to the form data
        if (event.detail.visit.data instanceof FormData) {
            // Check if token is already in FormData (don't duplicate)
            if (!event.detail.visit.data.has('_token')) {
                event.detail.visit.data.append('_token', csrfToken);
            }
        }
    }
});

// Handle errors - refresh CSRF token on 419 errors
router.on('error', (event) => {
    // If we get a 419 error, refresh the CSRF token
    const errors = event.detail.errors || {};
    const response = event.detail.response;
    
    const is419Error = 
        errors.form === '419 Page Expired' || 
        errors.message === '419 Page Expired' ||
        (typeof errors.form === 'string' && errors.form.includes('419')) ||
        (typeof errors.message === 'string' && errors.message.includes('419')) ||
        response?.status === 419 ||
        (response?.statusText && response.statusText.includes('419'));
    
    if (is419Error) {
        console.warn('419 Page Expired - CSRF token expired. Reloading page to refresh token...');
        // Force reload after a short delay to allow error message to display
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
});

// Refresh CSRF token after successful requests to prevent expiration
router.on('finish', (event) => {
    // Update CSRF token from response headers if available
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag && event.detail.response) {
        // Laravel will update the meta tag on each request
        // The token should already be fresh from the response
    }
});

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
