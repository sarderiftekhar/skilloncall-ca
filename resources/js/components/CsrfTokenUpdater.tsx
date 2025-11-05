import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Component that automatically updates the CSRF token meta tag
 * whenever Inertia receives new props with an updated token.
 * This prevents 419 errors by ensuring the meta tag always matches the session token.
 */
export function CsrfTokenUpdater() {
    const page = usePage();
    const csrfToken = (page.props as any)?.csrfToken;

    useEffect(() => {
        if (csrfToken) {
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                const currentToken = metaTag.getAttribute('content');
                if (currentToken !== csrfToken) {
                    metaTag.setAttribute('content', csrfToken);
                    console.debug('CSRF token meta tag updated from Inertia props');
                }
            }
        }
    }, [csrfToken]);

    // This component doesn't render anything
    return null;
}

