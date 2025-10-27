import { ComponentType } from 'react';

interface FeatherIconProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
}

interface IconProps {
    iconNode?: ComponentType<FeatherIconProps> | null;
    className?: string;
}

export function Icon({ iconNode: IconComponent, className }: IconProps) {
    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className} />;
}
