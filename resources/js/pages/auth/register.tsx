import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { Loader } from 'react-feather';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />

            <Card style={{ backgroundColor: '#FFFFFF' }} className="relative shadow-[0_12px_28px_rgba(16,179,214,0.10)]">
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-1.5 rounded-t-xl bg-[#10B3D6]" />
                <CardContent className="pt-6">
                    <Form
                        {...RegisteredUserController.store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    className="text-gray-900 placeholder:text-gray-500"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="text-gray-900 placeholder:text-gray-500"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Register as</Label>
                                <Select name="role" defaultValue="employee" onValueChange={(value) => {
                                    const input = document.querySelector('input[name="role"]') as HTMLInputElement | null;
                                    if (input) input.value = value;
                                }}>
                                    <SelectTrigger id="role" className="cursor-pointer">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employer">Employer</SelectItem>
                                        <SelectItem value="employee">Employee</SelectItem>
                                    </SelectContent>
                                </Select>
                                {/* Hidden input to submit Select value */}
                                <input type="hidden" name="role" defaultValue="employee" />
                                <InputError message={errors.role} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    className="text-gray-900 placeholder:text-gray-500"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    className="text-gray-900 placeholder:text-gray-500"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full text-white hover:opacity-90 cursor-pointer" style={{ backgroundColor: '#10B3D6' }} tabIndex={5} disabled={processing}>
                                {processing && <Loader className="h-4 w-4 animate-spin" />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6} className="text-[#10B3D6] hover:opacity-90 cursor-pointer">
                                Log in
                            </TextLink>
                        </div>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
