import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

interface PublicLayoutProps {
    title?: string;
    children: ReactNode;
}

export default function PublicLayout({ title = 'SkillOnCall.ca', children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F6FBFD' }}>
            <Head title={title} />
            
            {/* Simple Header */}
            <header className="w-full shadow-sm" style={{ backgroundColor: '#192341' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div 
                                className="rounded-full flex items-center justify-center text-white font-bold"
                                style={{
                                    backgroundColor: '#10B3D6', 
                                    width: '40px', 
                                    height: '40px', 
                                    fontSize: '16px'
                                }}
                            >
                                S
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    SkillOnCall.ca
                                </h1>
                                <p className="text-xs text-gray-300">
                                    Development Progress Tracker
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="w-full mt-16 py-8 text-white" style={{ backgroundColor: '#10B3D6' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm">
                        © 2025 SkillOnCall.ca - Canada's Premier Skilled Worker Platform
                    </p>
                    <p className="text-xs mt-2 opacity-90">
                        Development Progress Tracker - Public Access
                    </p>
                </div>
            </footer>
        </div>
    );
}
