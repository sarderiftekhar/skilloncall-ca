import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { router } from '@inertiajs/react';
import { initializeTheme } from './hooks/use-appearance';
import { getStoredLocale } from './lib/locale-storage';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Helper function to get fresh CSRF token from meta tag
function getCsrfToken(): string | null {
    // Always read fresh from DOM to ensure we have the latest token
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag?.getAttribute('content') || null;
}

// Set up CSRF token and locale header for Inertia requests
router.on('before', (event) => {
    // Ensure headers object exists
    if (!event.detail.visit.headers) {
        event.detail.visit.headers = {};
    }
    
    // Add X-Locale header from localStorage (for guest users and all requests)
    const storedLocale = getStoredLocale();
    if (storedLocale) {
        event.detail.visit.headers['X-Locale'] = storedLocale;
    }
    
    // Always get fresh token from meta tag (don't cache it)
    const csrfToken = getCsrfToken();
    if (csrfToken && event.detail.visit.method !== 'get') {
        // Always set X-CSRF-TOKEN header with fresh token
        event.detail.visit.headers['X-CSRF-TOKEN'] = csrfToken;
        event.detail.visit.headers['X-Requested-With'] = 'XMLHttpRequest';
        
        // If using FormData, also add token to the form data
        if (event.detail.visit.data instanceof FormData) {
            // Check if token is already in FormData (don't duplicate)
            if (!event.detail.visit.data.has('_token')) {
                event.detail.visit.data.append('_token', csrfToken);
            } else {
                // Update existing token with fresh one
                event.detail.visit.data.set('_token', csrfToken);
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

// Update CSRF token from Inertia page props after any successful request
// This handles both navigating and non-navigating requests
router.on('finish', (event) => {
    // Update CSRF token from Inertia props if available
    // This ensures the meta tag always has the latest token after each request
    try {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (!metaTag) return;

        // Access the Inertia page through the global Inertia instance
        // The page object is available after requests complete
        const inertia = (window as any).Inertia;
        if (inertia && inertia.page && inertia.page.props) {
            const csrfToken = inertia.page.props.csrfToken;
            if (csrfToken && typeof csrfToken === 'string') {
                const currentToken = metaTag.getAttribute('content');
                if (currentToken !== csrfToken) {
                    metaTag.setAttribute('content', csrfToken);
                    console.debug('CSRF token updated from Inertia props (finish event)');
                }
            }
        }
    } catch (e) {
        // Silently fail if we can't update the token
        console.debug('Could not update CSRF token:', e);
    }
});

// Also update on success event for navigating requests
router.on('success', (event) => {
    // Update the meta tag CSRF token from the Inertia props
    // This ensures we always have the latest token that matches the session
    try {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag && event.detail.page?.props?.csrfToken) {
            const newToken = event.detail.page.props.csrfToken;
            const currentToken = metaTag.getAttribute('content');
            if (currentToken !== newToken) {
                metaTag.setAttribute('content', newToken);
                console.debug('CSRF token updated from Inertia props (success event)');
            }
        }
    } catch (e) {
        console.debug('Could not update CSRF token on success:', e);
    }
});

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Update CSRF token from initial props on page load
        if (props.initialPage?.props?.csrfToken) {
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.setAttribute('content', props.initialPage.props.csrfToken);
            }
        }

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
