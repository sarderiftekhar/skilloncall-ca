import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SubscriptionInfo } from '@/types';
import { Shield, AlertCircle, CheckCircle, Clock } from 'react-feather';
import { Link } from '@inertiajs/react';

interface SubscriptionBadgeProps {
    subscription: SubscriptionInfo | null;
}

export function SubscriptionBadge({ subscription }: SubscriptionBadgeProps) {
    if (!subscription) {
        return (
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/subscriptions"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-[#10B3D6] to-[#0D8FA8] hover:from-[#0D8FA8] hover:to-[#0A7A94] transition-all cursor-pointer border border-[#10B3D6] shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Shield className="w-4 h-4 text-white" />
                            <span className="text-xs font-semibold text-white">Free Tier</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                        <div className="text-sm">
                            <p className="font-semibold mb-1 text-white">Free Plan</p>
                            <p className="text-xs text-white">Upgrade to unlock premium features and unlimited access</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    const getStatusColor = () => {
        if (subscription.is_cancelled) return 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-orange-500 shadow-lg hover:shadow-xl transform hover:scale-105';
        if (subscription.status === 'active') {
            if (subscription.days_until_expiration !== null && subscription.days_until_expiration <= 7) {
                return 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 border-yellow-500 shadow-lg hover:shadow-xl transform hover:scale-105';
            }
            return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-green-500 shadow-lg hover:shadow-xl transform hover:scale-105';
        }
        if (subscription.status === 'expired') return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-red-500 shadow-lg hover:shadow-xl transform hover:scale-105';
        return 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 border-gray-500 shadow-lg hover:shadow-xl transform hover:scale-105';
    };

    const getStatusIcon = () => {
        if (subscription.is_cancelled) return <AlertCircle className="w-4 h-4 text-white" />;
        if (subscription.status === 'active') {
            if (subscription.days_until_expiration !== null && subscription.days_until_expiration <= 7) {
                return <Clock className="w-4 h-4 text-white" />;
            }
            return <CheckCircle className="w-4 h-4 text-white" />;
        }
        if (subscription.status === 'expired') return <AlertCircle className="w-4 h-4 text-white" />;
        return <Shield className="w-4 h-4 text-white" />;
    };

    const getStatusText = () => {
        if (subscription.is_cancelled) return 'Cancelled';
        if (subscription.status === 'active') {
            if (subscription.days_until_expiration !== null && subscription.days_until_expiration <= 7) {
                return 'Expiring Soon';
            }
            return subscription.plan_name;
        }
        return subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
    };

    const getTooltipContent = () => {
        if (subscription.is_cancelled) {
            return (
                <>
                    <p className="font-semibold mb-1">{subscription.plan_name} - Cancelled</p>
                    <p className="text-xs text-gray-600">
                        Access until {subscription.ends_at}
                    </p>
                </>
            );
        }
        if (subscription.status === 'active') {
            if (subscription.days_until_expiration !== null && subscription.days_until_expiration <= 7) {
                return (
                    <>
                        <p className="font-semibold mb-1">{subscription.plan_name}</p>
                        <p className="text-xs text-yellow-700">
                            Expires in {subscription.days_until_expiration} day{subscription.days_until_expiration !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            Renew before {subscription.ends_at}
                        </p>
                    </>
                );
            }
            return (
                <>
                    <p className="font-semibold mb-1">{subscription.plan_name}</p>
                    <p className="text-xs text-green-700">Active Subscription</p>
                    {subscription.ends_at && (
                        <p className="text-xs text-gray-600 mt-1">
                            Renews on {subscription.ends_at}
                        </p>
                    )}
                </>
            );
        }
        return (
            <>
                <p className="font-semibold mb-1">{subscription.plan_name}</p>
                <p className="text-xs text-gray-600">Status: {subscription.status}</p>
            </>
        );
    };

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href="/subscriptions"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer border shadow-sm ${getStatusColor()}`}
                    >
                        {getStatusIcon()}
                        <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                            {getStatusText()}
                        </span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                    <div className="text-sm">
                        {getTooltipContent()}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

