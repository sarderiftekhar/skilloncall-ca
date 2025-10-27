import { cn } from '@/lib/utils';
import { type ComponentType } from 'react';

interface FeatherIconProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
}

interface IconProps extends FeatherIconProps {
    iconNode: ComponentType<FeatherIconProps>;
}

export function Icon({ iconNode: IconComponent, className, ...props }: IconProps) {
    return <IconComponent className={cn('h-4 w-4', className)} {...props} />;
}
