import React from 'react';
import { User, Briefcase, Clock, Globe, Image } from 'react-feather';

interface Tab {
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    completionStatus: 'complete' | 'partial' | 'empty';
}

interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    tabs: Tab[];
    isLoading?: boolean;
}

export default function TabNavigation({ activeTab, onTabChange, tabs, isLoading = false }: TabNavigationProps) {
    return (
        <div className="bg-white border-b border-gray-200">
            {/* Desktop Tab Navigation */}
            <div className="hidden md:block">
                <nav className="flex space-x-2 px-6 pt-2" aria-label="Profile sections">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                disabled={isLoading}
                                className={`
                                    group relative flex items-center space-x-2 py-3 px-4 text-sm font-semibold transition-all duration-300 cursor-pointer rounded-t-xl
                                    ${isActive 
                                        ? 'text-white bg-gradient-to-br from-[#10B3D6] to-[#0D8FA8] shadow-lg transform scale-105' 
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:shadow-md'
                                    }
                                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                                `}
                                style={isActive ? { 
                                    boxShadow: '0 -2px 12px rgba(16, 179, 214, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)'
                                } : {}}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`${tab.id}-panel`}
                            >
                                <Icon 
                                    className={`h-5 w-5 transition-all duration-300 ${
                                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#10B3D6]'
                                    } ${isLoading && isActive ? 'animate-pulse' : ''}`}
                                />
                                <span className="whitespace-nowrap">{tab.title}</span>
                                
                                {/* Completion Status Indicator */}
                                <div 
                                    className={`
                                        w-2.5 h-2.5 rounded-full ml-2 transition-all duration-300
                                        ${tab.completionStatus === 'complete' ? (isActive ? 'bg-white shadow-sm' : 'bg-green-500') : ''}
                                        ${tab.completionStatus === 'partial' ? (isActive ? 'bg-yellow-200' : 'bg-yellow-500') : ''}
                                        ${tab.completionStatus === 'empty' ? (isActive ? 'bg-white/50' : 'bg-gray-300') : ''}
                                    `}
                                    title={
                                        tab.completionStatus === 'complete' ? 'Complete' :
                                        tab.completionStatus === 'partial' ? 'Partial' : 'Empty'
                                    }
                                />
                                
                                {/* Active indicator bar at bottom */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-sm"></div>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="md:hidden">
                <div className="px-4 py-3">
                    <select
                        value={activeTab}
                        onChange={(e) => onTabChange(e.target.value)}
                        className="block w-full rounded-lg border-2 border-gray-200 focus:border-[#10B3D6] focus:ring-2 focus:ring-[#10B3D6]/20 text-base font-medium cursor-pointer shadow-sm transition-all duration-200"
                        style={{ height: '2.7em' }}
                    >
                        {tabs.map((tab) => (
                            <option key={tab.id} value={tab.id}>
                                {tab.title}
                                {tab.completionStatus === 'complete' ? ' ✓' : 
                                 tab.completionStatus === 'partial' ? ' ◐' : ' ○'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

// Tab configuration
export const profileTabs: Tab[] = [
    {
        id: 'personal',
        title: 'Personal Details',
        icon: User,
        completionStatus: 'empty' // Will be dynamically calculated
    },
    {
        id: 'skills',
        title: 'Skills & Expertise',
        icon: Briefcase,
        completionStatus: 'empty'
    },
    {
        id: 'work-history',
        title: 'Work History',
        icon: Clock,
        completionStatus: 'empty'
    },
    {
        id: 'languages',
        title: 'Languages',
        icon: Globe,
        completionStatus: 'empty'
    },
    {
        id: 'portfolio',
        title: 'Portfolio & Certifications',
        icon: Image,
        completionStatus: 'empty'
    }
];
