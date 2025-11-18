import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/useTranslations';
import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import { AlertCircle } from 'react-feather';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { t } = useTranslations();

    return (
        <div className="space-y-4">
            <div className="space-y-3 p-4 rounded-lg bg-orange-50 border border-orange-200">
                <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                            <strong>{t('settings_page.deactivate_note', 'Note:')}</strong> {t('settings_page.deactivate_note_text', 'Deactivating your account will log you out and prevent access until reactivation. Your data will be preserved.')}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>{t('settings_page.permanent_delete_title', 'To permanently delete your account:')}</strong> {t('settings_page.permanent_delete_text', 'Please email')}{' '}
                            <a 
                                href="mailto:support@skilloncall.ca" 
                                className="text-[#10B3D6] hover:underline cursor-pointer font-medium"
                            >
                                support@skilloncall.ca
                            </a>
                            {' '}{t('settings_page.permanent_delete_text_end', 'with your account details.')}
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
                        {t('settings_page.deactivate_button', 'Deactivate Account')}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>{t('settings_page.deactivate_confirm_title', 'Are you sure you want to deactivate your account?')}</DialogTitle>
                    <DialogDescription>
                        {t('settings_page.deactivate_confirm_description', 'Your account will be temporarily deactivated and you will be logged out. You can contact')}{' '}
                        <a 
                            href="mailto:support@skilloncall.ca" 
                            className="text-[#10B3D6] hover:underline cursor-pointer"
                        >
                            support@skilloncall.ca
                        </a>
                        {' '}{t('settings_page.deactivate_confirm_description_end', 'to reactivate your account. Please enter your password to confirm.')}
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
                                        {t('settings_page.password_label', 'Password')}
                                    </Label>

                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        placeholder={t('settings_page.password_label', 'Password')}
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
                                            {t('settings_page.cancel', 'Cancel')}
                                        </Button>
                                    </DialogClose>

                                    <Button 
                                        variant="outline" 
                                        className="border-orange-400 text-orange-700 hover:bg-orange-100 cursor-pointer" 
                                        disabled={processing} 
                                        asChild
                                    >
                                        <button type="submit">{t('settings_page.deactivate_button', 'Deactivate Account')}</button>
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
