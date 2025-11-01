import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { Loader, Briefcase, User } from 'react-feather';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const [role, setRole] = useState<'employer' | 'employee'>('employee');
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
                                <Label htmlFor="name" className="font-bold">Name</Label>
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
                                <Label htmlFor="email" className="font-bold">Email address</Label>
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
                                <Label htmlFor="role" className="font-bold">Register as</Label>
                                <Select value={role} onValueChange={(value) => {
                                    setRole(value as 'employer' | 'employee');
                                    const input = document.querySelector('input[name="role"]') as HTMLInputElement | null;
                                    if (input) input.value = value;
                                }}>
                                    <SelectTrigger id="role" className="cursor-pointer h-auto py-2">
                                        {role ? (
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0" 
                                                     style={role === 'employer' ? {backgroundColor: '#FCF2F0'} : {backgroundColor: '#10B3D6'}}>
                                                    {role === 'employer' ? (
                                                        <Briefcase className="h-4 w-4" style={{color: '#10B3D6'}} />
                                                    ) : (
                                                        <User className="h-4 w-4 text-white" />
                                                    )}
                                                </div>
                                                <span className="font-semibold" style={role === 'employer' ? {color: '#10B3D6'} : {}}>
                                                    {role === 'employer' ? "I'm an Employer" : "I'm an Employee"}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">Select role</span>
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employer" className="cursor-pointer py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{backgroundColor: '#FCF2F0'}}>
                                                    <Briefcase className="h-5 w-5" style={{color: '#10B3D6'}} />
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span className="font-semibold text-base" style={{color: '#10B3D6'}}>I'm an Employer</span>
                                                    <span className="text-xs text-gray-500">Hiring skilled workers</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="employee" className="cursor-pointer py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{backgroundColor: '#10B3D6'}}>
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span className="font-semibold text-base">I'm an Employee</span>
                                                    <span className="text-xs text-gray-500">Looking for work</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {/* Hidden input to submit Select value */}
                                <input type="hidden" name="role" value={role} />
                                <InputError message={errors.role} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="font-bold">Password</Label>
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
                                <Label htmlFor="password_confirmation" className="font-bold">Confirm password</Label>
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
