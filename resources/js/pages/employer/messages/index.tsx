import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { 
    MessageSquare, 
    Search, 
    User,
    Mail,
    Calendar,
    Send
} from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';
import { useState } from 'react';

interface Employee {
    id: number;
    name: string;
    email: string;
    profile: {
        id: number;
        profile_picture: string | null;
    } | null;
}

interface LastMessage {
    message: string;
    created_at: string;
    sender_id: number;
}

interface Conversation {
    employee: Employee;
    last_message: LastMessage | null;
    unread_count: number;
    updated_at: string;
}

interface IndexMessagesPageProps {
    conversations: Conversation[];
    filters: {
        search?: string;
        employee?: string;
    };
    selectedEmployee?: string;
}

// Breadcrumbs will be set dynamically based on locale
const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('employer.messages.manage', 'Messages'),
        href: `/employer/messages?lang=${locale}`,
    },
];

export default function IndexMessagesPage({ conversations, filters, selectedEmployee }: IndexMessagesPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale);
    const queryLang = `?lang=${locale}`;

    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        employee: filters.employee || '',
    });

    const handleFilter = () => {
        get(`/employer/messages${queryLang}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            employee: '',
        });
        router.get(`/employer/messages${queryLang}`, {}, {
            preserveState: false,
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            if (diffInHours < 1) {
                const diffInMinutes = Math.floor(diffInHours * 60);
                return diffInMinutes < 1 ? t('employer.messages.just_now', 'Just now') : `${diffInMinutes} ${t('employer.messages.minutes_ago', 'min ago')}`;
            }
            return `${Math.floor(diffInHours)} ${t('employer.messages.hours_ago', 'h ago')}`;
        }
        
        return date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredConversations = conversations.filter(conv => {
        if (data.search) {
            const searchLower = data.search.toLowerCase();
            return (
                conv.employee.name.toLowerCase().includes(searchLower) ||
                conv.employee.email.toLowerCase().includes(searchLower) ||
                (conv.last_message && conv.last_message.message.toLowerCase().includes(searchLower))
            );
        }
        return true;
    });

    const handleConversationClick = (employeeId: number) => {
        router.visit(`/employer/messages/${employeeId}${queryLang}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employer.messages.manage', 'Messages')}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer, 
                    [onclick], [onClick], select, input[type="button"],
                    input[type="submit"], input[type="reset"] { 
                        cursor: pointer !important; 
                    }
                    
                    .page-title {
                        color: #192341 !important;
                    }
                    
                    .text-default {
                        color: #192341 !important;
                    }
                `}</style>
            </Head>
            
            <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex h-full flex-1 flex-col gap-6 sm:gap-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight page-title">
                                {t('employer.messages.manage', 'Messages')}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {t('employer.messages.subtitle', 'Communicate with skilled employees')}
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder={t('employer.messages.search_placeholder', 'Search conversations...')}
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                            className="pl-10 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <Button 
                                    className="text-white cursor-pointer"
                                    onClick={handleFilter}
                                    disabled={processing}
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    {t('employer.messages.search', 'Search')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conversations List */}
                    <Card className="bg-white rounded-xl shadow-sm" style={{ borderTop: '0.5px solid #192341' }}>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold page-title">
                                {t('employer.messages.conversations', 'Conversations')} ({filteredConversations.length})
                            </CardTitle>
                            <CardDescription>
                                {t('employer.messages.showing', 'Showing')} {filteredConversations.length} {t('employer.messages.conversations', 'conversations')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredConversations.length > 0 ? (
                                <div className="space-y-2">
                                    {filteredConversations.map((conversation) => (
                                        <div
                                            key={conversation.employee.id}
                                            className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                                            style={{ backgroundColor: '#FCF2F0' }}
                                            onClick={() => handleConversationClick(conversation.employee.id)}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    {conversation.employee.profile?.profile_picture ? (
                                                        <img
                                                            src={conversation.employee.profile.profile_picture}
                                                            alt={conversation.employee.name}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-[#10B3D6] flex items-center justify-center">
                                                            <User className="h-6 w-6 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="text-lg font-semibold text-default">
                                                            {conversation.employee.name}
                                                        </h3>
                                                        {conversation.unread_count > 0 && (
                                                            <Badge className="bg-[#10B3D6] text-white" style={{fontSize: '11px'}}>
                                                                {conversation.unread_count}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                        <Mail className="h-3 w-3" />
                                                        <span className="truncate">{conversation.employee.email}</span>
                                                    </div>
                                                    {conversation.last_message && (
                                                        <>
                                                            <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                                                                {conversation.last_message.message}
                                                            </p>
                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>{formatDate(conversation.last_message.created_at)}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    {!conversation.last_message && (
                                                        <p className="text-sm text-gray-500 italic">
                                                            {t('employer.messages.no_messages_yet', 'No messages yet')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {t('employer.messages.no_conversations_found', 'No conversations found')}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {t('employer.messages.no_conversations_description', 'Start a conversation with an employee to get started')}
                                    </p>
                                    <Button 
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() => router.visit(`/employer/employees${queryLang}`)}
                                        style={{height: '2.7em'}}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        {t('employer.messages.browse_employees', 'Browse Employees')}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

