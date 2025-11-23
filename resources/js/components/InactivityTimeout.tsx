import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PageProps {
    auth?: {
        user?: {
            id: number;
        };
    };
}

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const WARNING_TIME = 1 * 60 * 1000; // 1 minute before timeout

export function InactivityTimeout() {
    const { props } = usePage<PageProps>();
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [showWarning, setShowWarning] = useState(false);
    
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityRef = useRef<number>(Date.now());
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check if user is authenticated
    const isAuthenticated = props.auth?.user !== undefined;

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        // Reset activity on user interaction
        const resetActivity = () => {
            lastActivityRef.current = Date.now();
            setShowWarning(false);
            
            // Clear existing timeouts
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current);
            }

            // Set warning timeout (1 minute before main timeout)
            warningTimeoutRef.current = setTimeout(() => {
                setShowWarning(true);
            }, INACTIVITY_TIMEOUT - WARNING_TIME);

            // Set main timeout
            timeoutRef.current = setTimeout(() => {
                setShowModal(true);
            }, INACTIVITY_TIMEOUT);
        };

        // Track user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        events.forEach(event => {
            document.addEventListener(event, resetActivity, { passive: true });
        });

        // Initial timeout setup
        resetActivity();

        // Check inactivity status from server periodically
        checkIntervalRef.current = setInterval(async () => {
            try {
                const response = await fetch('/auth/reauthenticate/check', {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.requires_reauth) {
                        setShowModal(true);
                    }
                }
            } catch (error) {
                // Silently fail - don't interrupt user experience
                console.debug('Failed to check re-auth status:', error);
            }
        }, 30000); // Check every 30 seconds

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetActivity);
            });
            
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current);
            }
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
        };
    }, [isAuthenticated]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            router.post('/auth/reauthenticate', {
                password,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    setPassword('');
                    setError('');
                    setShowWarning(false);
                    // Reset activity timestamp
                    lastActivityRef.current = Date.now();
                },
                onError: (errors) => {
                    setError(errors.password || 'Invalid password. Please try again.');
                    setPassword('');
                },
                onFinish: () => {
                    setLoading(false);
                },
            });
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    // Calculate time remaining for display
    useEffect(() => {
        if (showWarning && !showModal) {
            const interval = setInterval(() => {
                const elapsed = Date.now() - lastActivityRef.current;
                const remaining = Math.max(0, INACTIVITY_TIMEOUT - elapsed);
                setTimeRemaining(Math.ceil(remaining / 1000)); // Convert to seconds
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [showWarning, showModal]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            {/* Warning Banner */}
            {showWarning && !showModal && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center z-50">
                    <p className="text-sm font-medium">
                        {timeRemaining !== null && timeRemaining > 0
                            ? `You will be logged out in ${Math.ceil(timeRemaining / 60)} minute${Math.ceil(timeRemaining / 60) !== 1 ? 's' : ''} due to inactivity. Please interact with the page to continue.`
                            : 'You will be logged out soon due to inactivity. Please interact with the page to continue.'}
                    </p>
                </div>
            )}

            {/* Re-authentication Modal */}
            <Dialog open={showModal} onOpenChange={() => {}}>
                <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Session Timeout</DialogTitle>
                        <DialogDescription>
                            For your security, please re-enter your password to continue your session.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoFocus
                                    required
                                    disabled={loading}
                                />
                                {error && (
                                    <p className="text-sm text-red-600">{error}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleLogout}
                                disabled={loading}
                            >
                                Logout
                            </Button>
                            <Button type="submit" disabled={loading || !password}>
                                {loading ? 'Verifying...' : 'Continue Session'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

