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
}

export default function TabNavigation({ activeTab, onTabChange, tabs }: TabNavigationProps) {
    return (
        <div className="border-b border-gray-200 bg-white">
            {/* Desktop Tab Navigation */}
            <div className="hidden md:block">
                <nav className="flex space-x-8 px-6" aria-label="Profile sections">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`
                                    group relative flex items-center space-x-2 py-4 px-1 text-sm font-medium transition-colors duration-200 cursor-pointer
                                    ${isActive 
                                        ? 'text-[#10B3D6] border-b-2 border-[#10B3D6]' 
                                        : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                                    }
                                `}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`${tab.id}-panel`}
                            >
                                <Icon 
                                    className={`h-5 w-5 transition-colors ${
                                        isActive ? 'text-[#10B3D6]' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                <span>{tab.title}</span>
                                
                                {/* Completion Status Indicator */}
                                <div 
                                    className={`
                                        w-2 h-2 rounded-full ml-2 transition-colors
                                        ${tab.completionStatus === 'complete' ? 'bg-green-500' : ''}
                                        ${tab.completionStatus === 'partial' ? 'bg-yellow-500' : ''}
                                        ${tab.completionStatus === 'empty' ? 'bg-gray-300' : ''}
                                    `}
                                    title={
                                        tab.completionStatus === 'complete' ? 'Complete' :
                                        tab.completionStatus === 'partial' ? 'Partial' : 'Empty'
                                    }
                                />
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
                        className="block w-full rounded-md border-gray-300 focus:border-[#10B3D6] focus:ring-[#10B3D6] text-base cursor-pointer"
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
