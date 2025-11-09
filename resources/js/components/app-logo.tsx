import { cn } from '@/lib/utils';

type AppLogoProps = {
    variant?: 'light' | 'dark';
    className?: string;
};

export default function AppLogo({ variant = 'dark', className }: AppLogoProps) {
    const isLight = variant === 'light';

    return (
        <div className={cn('flex items-center', className)}>
            <img
                src={isLight ? '/logo.png' : '/logo-white.png'}
                alt="SkillOnCall.ca logo"
                className="h-8 w-8 flex-shrink-0"
            />
            <span className={cn('ml-2 text-lg font-bold leading-none', isLight ? 'text-gray-900' : 'text-white')}>
                SkillOnCall
            </span>
            <span className={cn('ml-1 text-lg font-bold leading-none', isLight ? 'text-cyan-600' : 'text-cyan-400')}>
                .ca
            </span>
        </div>
    );
}
