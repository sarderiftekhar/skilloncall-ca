import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import { AlertCircle } from 'react-feather';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-4">
            <div className="space-y-3 p-4 rounded-lg bg-orange-50 border border-orange-200">
                <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                            <strong>Note:</strong> Deactivating your account will log you out and prevent access until reactivation. 
                            Your data will be preserved.
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>To permanently delete your account:</strong> Please email{' '}
                            <a 
                                href="mailto:support@skilloncall.ca" 
                                className="text-[#10B3D6] hover:underline cursor-pointer font-medium"
                            >
                                support@skilloncall.ca
                            </a>
                            {' '}with your account details.
                        </p>
                    </div>
                </div>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button 
                        variant="outline" 
                        className="border-orange-400 text-orange-700 hover:bg-orange-100 cursor-pointer"
                        style={{ height: '2.7em' }}
                    >
                        Deactivate Account
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Are you sure you want to deactivate your account?</DialogTitle>
                    <DialogDescription>
                        Your account will be temporarily deactivated and you will be logged out. You can contact{' '}
                        <a 
                            href="mailto:support@skilloncall.ca" 
                            className="text-[#10B3D6] hover:underline cursor-pointer"
                        >
                            support@skilloncall.ca
                        </a>
                        {' '}to reactivate your account. Please enter your password to confirm.
                    </DialogDescription>

                    <Form
                        {...ProfileController.destroy.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        onError={() => passwordInput.current?.focus()}
                        resetOnSuccess
                        className="space-y-6"
                    >
                        {({ resetAndClearErrors, processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="sr-only">
                                        Password
                                    </Label>

                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        placeholder="Password"
                                        autoComplete="current-password"
                                    />

                                    <InputError message={errors.password} />
                                </div>

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => resetAndClearErrors()}
                                            className="cursor-pointer"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button 
                                        variant="outline" 
                                        className="border-orange-400 text-orange-700 hover:bg-orange-100 cursor-pointer" 
                                        disabled={processing} 
                                        asChild
                                    >
                                        <button type="submit">Deactivate Account</button>
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
