/**
 * Fetch with timeout utility
 * Wraps native fetch with timeout and retry logic
 */

export interface FetchOptions extends RequestInit {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}

export class TimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TimeoutError';
    }
}

export class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NetworkError';
    }
}

/**
 * Fetch with timeout and retry logic
 */
export async function fetchWithTimeout(
    url: string, 
    options: FetchOptions = {}
): Promise<Response> {
    const {
        timeout = 30000, // 30 second default timeout
        retries = 1,
        retryDelay = 1000,
        ...fetchOptions
    } = options;

    // Ensure credentials are sent for same-origin requests
    const defaultOptions: RequestInit = {
        credentials: 'same-origin',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            ...fetchOptions.headers,
        },
        ...fetchOptions,
    };

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, timeout);

            try {
                const response = await fetch(url, {
                    ...defaultOptions,
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                // Check for HTTP errors
                if (!response.ok) {
                    throw new NetworkError(
                        `HTTP ${response.status}: ${response.statusText}`
                    );
                }

                return response;
            } catch (error) {
                clearTimeout(timeoutId);

                if (error instanceof DOMException && error.name === 'AbortError') {
                    throw new TimeoutError(`Request timed out after ${timeout}ms`);
                }

                throw error;
            }
        } catch (error) {
            lastError = error as Error;

            // If this is the last attempt, throw the error
            if (attempt === retries) {
                break;
            }

            // Only retry on network/timeout errors, not on HTTP errors
            if (error instanceof NetworkError && attempt < retries) {
                console.warn(`Request failed (attempt ${attempt + 1}/${retries + 1}):`, error.message);
                console.warn(`Retrying in ${retryDelay}ms...`);
                
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }

            // Don't retry on timeout errors or other types of errors
            break;
        }
    }

    throw lastError!;
}

/**
 * POST request with timeout and CSRF token
 */
export async function postWithTimeout(
    url: string, 
    data: any, 
    options: FetchOptions = {}
): Promise<Response> {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers as Record<string, string>,
    };

    if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
    }

    return fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
        headers,
    });
}

/**
 * Upload files with timeout and progress tracking
 */
export async function uploadWithTimeout(
    url: string, 
    formData: FormData, 
    options: FetchOptions & { onProgress?: (progress: number) => void } = {}
): Promise<Response> {
    const { onProgress, ...fetchOptions } = options;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    // Add CSRF token to FormData if not already present
    if (csrfToken && !formData.has('_token')) {
        formData.append('_token', csrfToken);
    }

    const headers: Record<string, string> = {
        'X-Requested-With': 'XMLHttpRequest',
        ...fetchOptions.headers as Record<string, string>,
    };
    
    // Don't set Content-Type for FormData - browser will set it with boundary

    if ('XMLHttpRequest' in window && onProgress) {
        // Use XMLHttpRequest for progress tracking
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const timeout = fetchOptions.timeout || 120000; // 2 minutes for uploads
            
            const timeoutId = setTimeout(() => {
                xhr.abort();
                reject(new TimeoutError(`Upload timed out after ${timeout}ms`));
            }, timeout);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = (event.loaded / event.total) * 100;
                    onProgress(Math.round(progress));
                }
            };

            xhr.onload = () => {
                clearTimeout(timeoutId);
                const response = new Response(xhr.response, {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: new Headers(xhr.getAllResponseHeaders().split('\r\n').reduce((headers, line) => {
                        const [key, value] = line.split(': ');
                        if (key && value) {
                            headers[key] = value;
                        }
                        return headers;
                    }, {} as Record<string, string>)),
                });

                if (!response.ok) {
                    reject(new NetworkError(`HTTP ${response.status}: ${response.statusText}`));
                } else {
                    resolve(response);
                }
            };

            xhr.onerror = () => {
                clearTimeout(timeoutId);
                reject(new NetworkError('Network error occurred during upload'));
            };

            xhr.onabort = () => {
                clearTimeout(timeoutId);
                reject(new TimeoutError('Upload was aborted'));
            };

            xhr.open('POST', url);
            
            // Set headers
            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });

            xhr.send(formData);
        });
    } else {
        // Fallback to regular fetch
        return fetchWithTimeout(url, {
            method: 'POST',
            body: formData,
            timeout: 120000, // 2 minutes for uploads
            ...fetchOptions,
            headers,
        });
    }
}

/**
 * Utility to check file size before upload
 */
export function validateFileSize(file: File, maxSizeInMB: number = 5): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
}

/**
 * Utility to validate multiple files total size
 */
export function validateTotalFileSize(files: File[], maxTotalSizeInMB: number = 25): boolean {
    const maxTotalSizeInBytes = maxTotalSizeInMB * 1024 * 1024;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    return totalSize <= maxTotalSizeInBytes;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
