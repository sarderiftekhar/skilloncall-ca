import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FeedbackModal from '@/components/feedback-modal';
import { User, CheckCircle } from 'react-feather';

// Tab components
import TabNavigation, { profileTabs } from '@/components/profile/TabNavigation';
import PersonalInfoTab from '@/components/profile/tabs/PersonalInfoTab';
import SkillsExperienceTab from '@/components/profile/tabs/SkillsExperienceTab';
import WorkHistoryTab from '@/components/profile/tabs/WorkHistoryTab';
import LanguagesTab from '@/components/profile/tabs/LanguagesTab';
import PortfolioCertificationsTab from '@/components/profile/tabs/PortfolioCertificationsTab';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewStats from '@/components/reviews/ReviewStats';
import { Link } from '@inertiajs/react';

// Loading Skeleton Components
const ProfileHeaderSkeleton = () => (
  <div className="mb-8">
    <Card className="border border-gray-200 animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Profile Photo Skeleton */}
            <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
            
            {/* Profile Info Skeleton */}
            <div>
              <div className="h-8 bg-gray-300 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
          </div>
          
          {/* Profile Completion Skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="text-right">
              <div className="h-4 bg-gray-300 rounded w-32 mb-1 animate-pulse"></div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-gray-300 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  </div>
);

const TabNavigationSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex flex-wrap gap-2 border-b border-gray-200">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent">
          <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
          <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

const TabContentSkeleton = () => (
  <div className="mt-6 animate-pulse">
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form Fields Skeleton */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-100 rounded border-2 border-gray-200 animate-pulse"></div>
          </div>
        ))}
        
        {/* Action Buttons Skeleton */}
        <div className="flex justify-end space-x-3 pt-4">
          <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  </div>
);

type PageProps = {
  mode: 'view' | 'edit';
  profile: any;
  profileCompletion: number;
  globalSkills?: any[];
  globalIndustries?: any[];
  globalLanguages?: any[];
  globalCertifications?: any[];
  globalProvinces?: any[];
};

export default function EmployeeProfilePage(props: PageProps) {
  const { profile, profileCompletion, globalSkills = [], globalLanguages = [], globalCertifications = [], globalProvinces = [] } = props;
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [showTabContent, setShowTabContent] = useState(true);
  const [modal, setModal] = useState<{open:boolean; title:string; msg:string; type:'success'|'error'|'info'; details?:string[]}>({open:false, title:'', msg:'', type:'info'});

  // Loading animation effect
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Quick content reveal
      setTimeout(() => setShowContent(true), 50);
    }, 800);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Handle tab change with animation
  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab || isTabLoading) return;
    
    setIsTabLoading(true);
    setShowTabContent(false);
    
    // Animate out current content
    setTimeout(() => {
      setActiveTab(tabId);
      
      // Animate in new content
      setTimeout(() => {
        setIsTabLoading(false);
        setShowTabContent(true);
      }, 50);
    }, 200);
  };

  // Calculate completion status for each tab
  const tabsWithCompletion = useMemo(() => {
    return profileTabs.map(tab => {
      let completionStatus: 'complete' | 'partial' | 'empty' = 'empty';
      
      switch (tab.id) {
        case 'personal':
          if (profile?.first_name && profile?.last_name && profile?.phone && profile?.address_line_1) {
            completionStatus = 'complete';
          } else if (profile?.first_name || profile?.last_name) {
            completionStatus = 'partial';
          }
          break;
        case 'skills':
          if (profile?.skills?.length > 0 && profile?.overall_experience) {
            completionStatus = 'complete';
          } else if (profile?.skills?.length > 0 || profile?.overall_experience) {
            completionStatus = 'partial';
          }
          break;
        case 'work-history':
          if (profile?.work_experiences?.length > 0 && profile?.employment_status) {
            completionStatus = 'complete';
          } else if (profile?.work_experiences?.length > 0 || profile?.employment_status) {
            completionStatus = 'partial';
          }
          break;
        case 'languages':
          if (profile?.languages?.length > 0) {
            completionStatus = 'complete';
          }
          break;
        case 'portfolio':
          if (profile?.portfolio_photos?.length > 0 || profile?.certifications?.length > 0) {
            completionStatus = profile?.portfolio_photos?.length > 0 && profile?.certifications?.length > 0 ? 'complete' : 'partial';
          }
          break;
      }
      
      return { ...tab, completionStatus };
    });
  }, [profile]);

  const handleUpdate = async (data: any) => {
    try {
      // Check if we're uploading any files (profile photo or portfolio photos)
      const hasProfilePhoto = data.profile_photo instanceof File;
      const hasPortfolioFiles = Object.keys(data).some(key => 
        key.includes('portfolio_photos') && key.includes('[file]') && data[key] instanceof File
      );
      const hasFile = hasProfilePhoto || hasPortfolioFiles;
      
      console.log('Profile update attempt:', {
        data_keys: Object.keys(data),
        has_profile_photo: hasProfilePhoto,
        has_portfolio_files: hasPortfolioFiles,
        has_file: hasFile,
        profile_file_name: hasProfilePhoto ? data.profile_photo.name : null,
        portfolio_file_count: Object.keys(data).filter(key => key.includes('portfolio_photos') && key.includes('[file]')).length
      });

      // Debug the actual data being sent
      if (hasFile) {
        console.log('🚀 FILE UPLOAD DETECTED - Full data inspection:');
        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof File) {
            console.log(`📁 File found at key "${key}":`, {
              name: value.name,
              size: value.size,
              type: value.type
            });
          } else {
            console.log(`📝 Data at key "${key}":`, typeof value === 'string' ? value.substring(0, 50) + '...' : value);
          }
        });
      }

      await router.post('/employee/profile', {
        _method: 'PUT',
        ...data
      }, {
        forceFormData: hasFile, // Use FormData for file uploads
        onError: (e) => {
          console.error('Profile update error:', e);
          setModal({
            open: true, 
            title: 'Please fix the highlighted fields', 
            msg: 'Some fields need your attention.', 
            type: 'error', 
            details: Object.values(e).map(String).slice(0, 6)
          });
          throw e; // Re-throw to let the tab component handle the error
        },
        onSuccess: (page) => {
          console.log('Profile update success');
          setModal({
            open: true, 
            title: 'Profile updated', 
            msg: 'Your changes have been saved successfully.', 
            type: 'success'
          });
          // The page should automatically refresh with updated data
        },
        preserveScroll: true
      });
    } catch (error) {
      // Error is handled in onError callback above
      throw error;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoTab 
            profile={profile} 
            onUpdate={handleUpdate}
            globalProvinces={globalProvinces}
          />
        );
      case 'skills':
        return (
          <SkillsExperienceTab 
            profile={profile} 
            globalSkills={globalSkills}
            onUpdate={handleUpdate}
          />
        );
      case 'work-history':
        return (
          <WorkHistoryTab 
            profile={profile} 
            onUpdate={handleUpdate}
          />
        );
      case 'languages':
        return (
          <LanguagesTab 
            profile={profile} 
            globalLanguages={globalLanguages}
            onUpdate={handleUpdate}
          />
        );
      case 'portfolio':
        return (
          <PortfolioCertificationsTab 
            profile={profile} 
            onUpdate={handleUpdate}
          />
        );
      case 'reviews':
        const reviews = profile?.reviews || [];
        const stats = profile?.review_stats || {
          total: 0,
          average: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ReviewStats stats={stats} />
              </div>
              <div className="lg:col-span-2">
                <ReviewList reviews={reviews} showJob={true} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <Head title="My Profile" />
      <FeedbackModal 
        isOpen={modal.open} 
        onClose={() => setModal(m=>({...m,open:false}))} 
        title={modal.title} 
        message={modal.msg} 
        type={modal.type} 
        details={modal.details} 
      />

      <div className="w-full px-6 py-8">
        {/* Profile Header */}
        <div className={`transition-all duration-400 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {isLoading ? (
            <ProfileHeaderSkeleton />
          ) : (
            <div className="mb-8">
              <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      {/* Profile Photo */}
                      <div
                        className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: '#FCF2F0' }}
                      >
                        {profile?.profile_photo ? (
                          <img
                            src={(() => {
                              const photo = profile.profile_photo;
                              if (!photo || typeof photo !== 'string') return '';
                              
                              // If already a full URL, use it as is
                              if (photo.startsWith('http://') || photo.startsWith('https://')) {
                                return photo;
                              }
                              
                              // Remove any existing /storage/ or storage/ prefix to avoid duplication
                              let cleanPath = photo;
                              if (cleanPath.startsWith('/storage/')) {
                                cleanPath = cleanPath.substring('/storage/'.length);
                              } else if (cleanPath.startsWith('storage/')) {
                                cleanPath = cleanPath.substring('storage/'.length);
                              }
                              
                              // Ensure the path doesn't start with a slash
                              cleanPath = cleanPath.replace(/^\/+/, '');
                              
                              // Return with /storage/ prefix
                              return `/storage/${cleanPath}`;
                            })()}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6" style={{ color: '#10B3D6' }} />
                        )}
                      </div>
                      
                      {/* Profile Info */}
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#192341' }}>
                          {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'My Profile'}
                        </h1>
                        <p className="text-gray-600">
                          {profile?.bio ? profile.bio.substring(0, 100) + '...' : 'Manage your professional profile'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Profile Completion */}
                    <div className="flex items-center gap-3">
                      {profileCompletion >= 100 ? (
                        <Badge className="text-white" style={{ backgroundColor: '#16a34a' }}>
                          <CheckCircle className="h-3 w-3 mr-1 text-white" /> 
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-sm">
                          {profileCompletion}% Complete
                        </Badge>
                      )}
                      
                      <div className="text-right">
                        <p className="text-sm font-medium" style={{ color: '#192341' }}>
                          Profile Completion
                        </p>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: '#10B3D6', 
                              width: `${profileCompletion}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className={`transition-all duration-400 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {isLoading ? (
            <TabNavigationSkeleton />
          ) : (
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tabs={tabsWithCompletion}
              isLoading={isTabLoading}
            />
          )}
        </div>

        {/* Tab Content */}
        <div className={`transition-all duration-400 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {isLoading ? (
            <TabContentSkeleton />
          ) : (
            <div className="mt-6">
              <div
                className={`transition-all duration-300 ease-out ${
                  showTabContent && !isTabLoading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {isTabLoading ? (
                  <TabContentSkeleton />
                ) : (
                  <div
                    id={`${activeTab}-panel`}
                    role="tabpanel"
                    aria-labelledby={`${activeTab}-tab`}
                  >
                    {renderTabContent()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}