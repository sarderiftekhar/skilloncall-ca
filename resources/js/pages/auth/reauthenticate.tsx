import { Head, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    timeout: number;
}

export default function Reauthenticate({ timeout }: Props) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        router.post('/auth/reauthenticate', {
            password,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Redirect will happen automatically
            },
            onError: (errors) => {
                setError(errors.password || 'Invalid password. Please try again.');
                setPassword('');
                setLoading(false);
            },
        });
    };

    return (
        <>
            <Head title="Re-authenticate" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Session Timeout</CardTitle>
                        <CardDescription>
                            For your security, please re-enter your password to continue your session.
                            Your session timed out after {timeout} minutes of inactivity.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
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
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.post('/logout')}
                                disabled={loading}
                            >
                                Logout
                            </Button>
                            <Button type="submit" disabled={loading || !password}>
                                {loading ? 'Verifying...' : 'Continue Session'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
}

