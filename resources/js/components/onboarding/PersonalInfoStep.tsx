import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ValidatedInput from '@/components/ui/validated-input';
import ValidatedTextarea from '@/components/ui/validated-textarea';
import React, { useState } from 'react';
import { AlertCircle, Camera, Shield, Upload, User } from 'react-feather';

interface PersonalInfoStepProps {
    formData: Record<string, unknown>;
    updateFormData: (data: Record<string, unknown>) => void;
    validationErrors: Record<string, string>;
}

const WORK_AUTHORIZATION_OPTIONS = [
    { value: 'canadian_citizen', label: 'Canadian Citizen' },
    { value: 'permanent_resident', label: 'Permanent Resident' },
    { value: 'work_permit', label: 'Work Permit' },
    { value: 'student_permit', label: 'Student Permit' },
];

const CANADIAN_PROVINCES = [
    { value: 'AB', label: 'Alberta' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland and Labrador' },
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'NT', label: 'Northwest Territories' },
    { value: 'NU', label: 'Nunavut' },
    { value: 'ON', label: 'Ontario' },
    { value: 'PE', label: 'Prince Edward Island' },
    { value: 'QC', label: 'Quebec' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'YT', label: 'Yukon' },
];

const CANADIAN_CITIES = [
    // Ontario
    { value: 'toronto', label: 'Toronto, ON' },
    { value: 'ottawa', label: 'Ottawa, ON' },
    { value: 'hamilton', label: 'Hamilton, ON' },
    { value: 'london', label: 'London, ON' },
    { value: 'kitchener', label: 'Kitchener, ON' },
    { value: 'windsor', label: 'Windsor, ON' },
    { value: 'oshawa', label: 'Oshawa, ON' },
    { value: 'barrie', label: 'Barrie, ON' },
    { value: 'guelph', label: 'Guelph, ON' },
    { value: 'kingston', label: 'Kingston, ON' },
    { value: 'thunder-bay', label: 'Thunder Bay, ON' },
    { value: 'sudbury', label: 'Sudbury, ON' },
    { value: 'waterloo', label: 'Waterloo, ON' },
    { value: 'cambridge', label: 'Cambridge, ON' },
    { value: 'sarnia', label: 'Sarnia, ON' },
    { value: 'peterborough', label: 'Peterborough, ON' },
    { value: 'belleville', label: 'Belleville, ON' },
    { value: 'sault-ste-marie', label: 'Sault Ste. Marie, ON' },
    { value: 'north-bay', label: 'North Bay, ON' },
    { value: 'cornwall', label: 'Cornwall, ON' },

    // Quebec
    { value: 'montreal', label: 'Montreal, QC' },
    { value: 'quebec-city', label: 'Quebec City, QC' },
    { value: 'laval', label: 'Laval, QC' },
    { value: 'gatineau', label: 'Gatineau, QC' },
    { value: 'longueuil', label: 'Longueuil, QC' },
    { value: 'sherbrooke', label: 'Sherbrooke, QC' },
    { value: 'trois-rivieres', label: 'Trois-Rivières, QC' },
    { value: 'saguenay', label: 'Saguenay, QC' },
    { value: 'levis', label: 'Lévis, QC' },
    { value: 'terrebonne', label: 'Terrebonne, QC' },
    { value: 'saint-jean-sur-richelieu', label: 'Saint-Jean-sur-Richelieu, QC' },
    { value: 'brossard', label: 'Brossard, QC' },
    { value: 'drummondville', label: 'Drummondville, QC' },
    { value: 'saint-jerome', label: 'Saint-Jérôme, QC' },
    { value: 'granby', label: 'Granby, QC' },
    { value: 'saint-hyacinthe', label: 'Saint-Hyacinthe, QC' },
    { value: 'shawinigan', label: 'Shawinigan, QC' },
    { value: 'dollard-des-ormeaux', label: 'Dollard-des-Ormeaux, QC' },
    { value: 'blainville', label: 'Blainville, QC' },
    { value: 'chateauguay', label: 'Châteauguay, QC' },

    // British Columbia
    { value: 'vancouver', label: 'Vancouver, BC' },
    { value: 'surrey', label: 'Surrey, BC' },
    { value: 'burnaby', label: 'Burnaby, BC' },
    { value: 'richmond', label: 'Richmond, BC' },
    { value: 'abbotsford', label: 'Abbotsford, BC' },
    { value: 'coquitlam', label: 'Coquitlam, BC' },
    { value: 'saanich', label: 'Saanich, BC' },
    { value: 'delta', label: 'Delta, BC' },
    { value: 'kelowna', label: 'Kelowna, BC' },
    { value: 'langley', label: 'Langley, BC' },
    { value: 'kamloops', label: 'Kamloops, BC' },
    { value: 'nanaimo', label: 'Nanaimo, BC' },
    { value: 'chilliwack', label: 'Chilliwack, BC' },
    { value: 'north-vancouver', label: 'North Vancouver, BC' },
    { value: 'west-vancouver', label: 'West Vancouver, BC' },
    { value: 'new-westminster', label: 'New Westminster, BC' },
    { value: 'port-coquitlam', label: 'Port Coquitlam, BC' },
    { value: 'maple-ridge', label: 'Maple Ridge, BC' },
    { value: 'white-rock', label: 'White Rock, BC' },
    { value: 'port-moody', label: 'Port Moody, BC' },

    // Alberta
    { value: 'calgary', label: 'Calgary, AB' },
    { value: 'edmonton', label: 'Edmonton, AB' },
    { value: 'red-deer', label: 'Red Deer, AB' },
    { value: 'lethbridge', label: 'Lethbridge, AB' },
    { value: 'medicine-hat', label: 'Medicine Hat, AB' },
    { value: 'grande-prairie', label: 'Grande Prairie, AB' },
    { value: 'airdrie', label: 'Airdrie, AB' },
    { value: 'spruce-grove', label: 'Spruce Grove, AB' },
    { value: 'lethbridge', label: 'Lethbridge, AB' },
    { value: 'fort-mcmurray', label: 'Fort McMurray, AB' },
    { value: 'sherwood-park', label: 'Sherwood Park, AB' },
    { value: 'st-albert', label: 'St. Albert, AB' },
    { value: 'brooks', label: 'Brooks, AB' },
    { value: 'camrose', label: 'Camrose, AB' },
    { value: 'cold-lake', label: 'Cold Lake, AB' },
    { value: 'drumheller', label: 'Drumheller, AB' },
    { value: 'grande-cache', label: 'Grande Cache, AB' },
    { value: 'hinton', label: 'Hinton, AB' },
    { value: 'lloydminster', label: 'Lloydminster, AB' },
    { value: 'wetaskiwin', label: 'Wetaskiwin, AB' },

    // Manitoba
    { value: 'winnipeg', label: 'Winnipeg, MB' },
    { value: 'brandon', label: 'Brandon, MB' },
    { value: 'steinbach', label: 'Steinbach, MB' },
    { value: 'thompson', label: 'Thompson, MB' },
    { value: 'portage-la-prairie', label: 'Portage la Prairie, MB' },
    { value: 'winkler', label: 'Winkler, MB' },
    { value: 'selkirk', label: 'Selkirk, MB' },
    { value: 'morden', label: 'Morden, MB' },
    { value: 'flin-flon', label: 'Flin Flon, MB' },
    { value: 'dauphin', label: 'Dauphin, MB' },
    { value: 'the-pas', label: 'The Pas, MB' },
    { value: 'swan-river', label: 'Swan River, MB' },
    { value: 'gimli', label: 'Gimli, MB' },
    { value: 'stonewall', label: 'Stonewall, MB' },
    { value: 'altona', label: 'Altona, MB' },
    { value: 'beausejour', label: 'Beausejour, MB' },
    { value: 'carberry', label: 'Carberry, MB' },
    { value: 'churchill', label: 'Churchill, MB' },
    { value: 'dauphin', label: 'Dauphin, MB' },
    { value: 'gimli', label: 'Gimli, MB' },

    // Saskatchewan
    { value: 'saskatoon', label: 'Saskatoon, SK' },
    { value: 'regina', label: 'Regina, SK' },
    { value: 'prince-albert', label: 'Prince Albert, SK' },
    { value: 'moose-jaw', label: 'Moose Jaw, SK' },
    { value: 'swift-current', label: 'Swift Current, SK' },
    { value: 'yorkton', label: 'Yorkton, SK' },
    { value: 'north-battleford', label: 'North Battleford, SK' },
    { value: 'estevan', label: 'Estevan, SK' },
    { value: 'weyburn', label: 'Weyburn, SK' },
    { value: 'lloydminster', label: 'Lloydminster, SK' },
    { value: 'martensville', label: 'Martensville, SK' },
    { value: 'humboldt', label: 'Humboldt, SK' },
    { value: 'melfort', label: 'Melfort, SK' },
    { value: 'battleford', label: 'Battleford, SK' },
    { value: 'kindersley', label: 'Kindersley, SK' },
    { value: 'meadow-lake', label: 'Meadow Lake, SK' },
    { value: 'melville', label: 'Melville, SK' },
    { value: 'north-battleford', label: 'North Battleford, SK' },
    { value: 'prince-albert', label: 'Prince Albert, SK' },
    { value: 'swift-current', label: 'Swift Current, SK' },

    // Nova Scotia
    { value: 'halifax', label: 'Halifax, NS' },
    { value: 'sydney', label: 'Sydney, NS' },
    { value: 'dartmouth', label: 'Dartmouth, NS' },
    { value: 'truro', label: 'Truro, NS' },
    { value: 'new-glasgow', label: 'New Glasgow, NS' },
    { value: 'glace-bay', label: 'Glace Bay, NS' },
    { value: 'amherst', label: 'Amherst, NS' },
    { value: 'kentville', label: 'Kentville, NS' },
    { value: 'bridgewater', label: 'Bridgewater, NS' },
    { value: 'yarmouth', label: 'Yarmouth, NS' },
    { value: 'antigonish', label: 'Antigonish, NS' },
    { value: 'wolfville', label: 'Wolfville, NS' },
    { value: 'lunenburg', label: 'Lunenburg, NS' },
    { value: 'berwick', label: 'Berwick, NS' },
    { value: 'digby', label: 'Digby, NS' },
    { value: 'liverpool', label: 'Liverpool, NS' },
    { value: 'shelburne', label: 'Shelburne, NS' },
    { value: 'windsor', label: 'Windsor, NS' },
    { value: 'annapolis-royal', label: 'Annapolis Royal, NS' },
    { value: 'chester', label: 'Chester, NS' },

    // New Brunswick
    { value: 'moncton', label: 'Moncton, NB' },
    { value: 'saint-john', label: 'Saint John, NB' },
    { value: 'fredericton', label: 'Fredericton, NB' },
    { value: 'dieppe', label: 'Dieppe, NB' },
    { value: 'riverview', label: 'Riverview, NB' },
    { value: 'quispamsis', label: 'Quispamsis, NB' },
    { value: 'bathurst', label: 'Bathurst, NB' },
    { value: 'miramichi', label: 'Miramichi, NB' },
    { value: 'edmundston', label: 'Edmundston, NB' },
    { value: 'campbellton', label: 'Campbellton, NB' },
    { value: 'sackville', label: 'Sackville, NB' },
    { value: 'shediac', label: 'Shediac, NB' },
    { value: 'grand-falls', label: 'Grand Falls, NB' },
    { value: 'woodstock', label: 'Woodstock, NB' },
    { value: 'caraquet', label: 'Caraquet, NB' },
    { value: 'belledune', label: 'Belledune, NB' },
    { value: 'dalhousie', label: 'Dalhousie, NB' },
    { value: 'florenceville-bristol', label: 'Florenceville-Bristol, NB' },
    { value: 'grand-bay-westfield', label: 'Grand Bay-Westfield, NB' },
    { value: 'hampton', label: 'Hampton, NB' },

    // Newfoundland and Labrador
    { value: 'st-johns', label: "St. John's, NL" },
    { value: 'mount-pearl', label: 'Mount Pearl, NL' },
    { value: 'corner-brook', label: 'Corner Brook, NL' },
    { value: 'conception-bay-south', label: 'Conception Bay South, NL' },
    { value: 'grand-falls-windsor', label: 'Grand Falls-Windsor, NL' },
    { value: 'paradise', label: 'Paradise, NL' },
    { value: 'gander', label: 'Gander, NL' },
    { value: 'happy-valley-goose-bay', label: 'Happy Valley-Goose Bay, NL' },
    { value: 'labrador-city', label: 'Labrador City, NL' },
    { value: 'stephenville', label: 'Stephenville, NL' },
    { value: 'marystown', label: 'Marystown, NL' },
    { value: 'bay-roberts', label: 'Bay Roberts, NL' },
    { value: 'carbonear', label: 'Carbonear, NL' },
    { value: 'clarenville', label: 'Clarenville, NL' },
    { value: 'deer-lake', label: 'Deer Lake, NL' },
    { value: 'grand-bank', label: 'Grand Bank, NL' },
    { value: 'lewisporte', label: 'Lewisporte, NL' },
    { value: 'port-aux-basques', label: 'Port aux Basques, NL' },
    { value: 'springdale', label: 'Springdale, NL' },
    { value: 'torbay', label: 'Torbay, NL' },

    // Prince Edward Island
    { value: 'charlottetown', label: 'Charlottetown, PE' },
    { value: 'summerside', label: 'Summerside, PE' },
    { value: 'stratford', label: 'Stratford, PE' },
    { value: 'cornwall', label: 'Cornwall, PE' },
    { value: 'montague', label: 'Montague, PE' },
    { value: 'kensington', label: 'Kensington, PE' },
    { value: 'alberton', label: 'Alberton, PE' },
    { value: 'souris', label: 'Souris, PE' },
    { value: 'georgetown', label: 'Georgetown, PE' },
    { value: "o'leary", label: "O'Leary, PE" },
    { value: 'tyne-valley', label: 'Tyne Valley, PE' },
    { value: 'wellington', label: 'Wellington, PE' },
    { value: 'alberton', label: 'Alberton, PE' },
    { value: 'borden-carleton', label: 'Borden-Carleton, PE' },
    { value: 'cavendish', label: 'Cavendish, PE' },
    { value: 'crapaud', label: 'Crapaud, PE' },
    { value: 'elmsdale', label: 'Elmsdale, PE' },
    { value: 'hunter-river', label: 'Hunter River, PE' },
    { value: 'miscouche', label: 'Miscouche, PE' },
    { value: 'north-rustico', label: 'North Rustico, PE' },

    // Northwest Territories
    { value: 'yellowknife', label: 'Yellowknife, NT' },
    { value: 'hay-river', label: 'Hay River, NT' },
    { value: 'inuvik', label: 'Inuvik, NT' },
    { value: 'fort-smith', label: 'Fort Smith, NT' },
    { value: 'behchoko', label: 'Behchokò, NT' },
    { value: 'fort-simpson', label: 'Fort Simpson, NT' },
    { value: 'norman-wells', label: 'Norman Wells, NT' },
    { value: 'tuktoyaktuk', label: 'Tuktoyaktuk, NT' },
    { value: 'arctic-red-river', label: 'Arctic Red River, NT' },
    { value: 'deline', label: 'Deline, NT' },
    { value: 'fort-good-hope', label: 'Fort Good Hope, NT' },
    { value: 'fort-liard', label: 'Fort Liard, NT' },
    { value: 'fort-mcpherson', label: 'Fort McPherson, NT' },
    { value: 'fort-providence', label: 'Fort Providence, NT' },
    { value: 'fort-resolution', label: 'Fort Resolution, NT' },
    { value: 'kakisa', label: 'Kakisa, NT' },
    { value: "lutselk'e", label: "Lutselk'e, NT" },
    { value: 'nahanni-butte', label: 'Nahanni Butte, NT' },
    { value: 'paulatuk', label: 'Paulatuk, NT' },
    { value: 'sachs-harbour', label: 'Sachs Harbour, NT' },

    // Yukon
    { value: 'whitehorse', label: 'Whitehorse, YT' },
    { value: 'dawson-city', label: 'Dawson City, YT' },
    { value: 'watson-lake', label: 'Watson Lake, YT' },
    { value: 'haines-junction', label: 'Haines Junction, YT' },
    { value: 'carmacks', label: 'Carmacks, YT' },
    { value: 'mayo', label: 'Mayo, YT' },
    { value: 'ross-river', label: 'Ross River, YT' },
    { value: 'teslin', label: 'Teslin, YT' },
    { value: 'old-crow', label: 'Old Crow, YT' },
    { value: 'beaver-creek', label: 'Beaver Creek, YT' },
    { value: 'burwash-landing', label: 'Burwash Landing, YT' },
    { value: 'carcross', label: 'Carcross, YT' },
    { value: 'champagne', label: 'Champagne, YT' },
    { value: 'eliza-lake', label: 'Eliza Lake, YT' },
    { value: 'faro', label: 'Faro, YT' },
    { value: 'keno-city', label: 'Keno City, YT' },
    { value: 'marsh-lake', label: 'Marsh Lake, YT' },
    { value: 'mount-lorne', label: 'Mount Lorne, YT' },
    { value: 'pelly-crossing', label: 'Pelly Crossing, YT' },
    { value: 'tagish', label: 'Tagish, YT' },

    // Nunavut
    { value: 'iqaluit', label: 'Iqaluit, NU' },
    { value: 'rankin-inlet', label: 'Rankin Inlet, NU' },
    { value: 'arviat', label: 'Arviat, NU' },
    { value: 'baker-lake', label: 'Baker Lake, NU' },
    { value: 'cambridge-bay', label: 'Cambridge Bay, NU' },
    { value: 'chesterfield-inlet', label: 'Chesterfield Inlet, NU' },
    { value: 'coral-harbour', label: 'Coral Harbour, NU' },
    { value: 'clyde-river', label: 'Clyde River, NU' },
    { value: 'gjoa-haven', label: 'Gjoa Haven, NU' },
    { value: 'hall-beach', label: 'Hall Beach, NU' },
    { value: 'igloolik', label: 'Igloolik, NU' },
    { value: 'kimmirut', label: 'Kimmirut, NU' },
    { value: 'kugaaruk', label: 'Kugaaruk, NU' },
    { value: 'kugluktuk', label: 'Kugluktuk, NU' },
    { value: 'pangnirtung', label: 'Pangnirtung, NU' },
    { value: 'pond-inlet', label: 'Pond Inlet, NU' },
    { value: 'repose-bay', label: 'Repulse Bay, NU' },
    { value: 'resolute-bay', label: 'Resolute Bay, NU' },
    { value: 'sanikiluaq', label: 'Sanikiluaq, NU' },
    { value: 'taloyoak', label: 'Taloyoak, NU' },
];

export default function PersonalInfoStep({ formData, updateFormData, validationErrors }: PersonalInfoStepProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [citySearch, setCitySearch] = useState<string>('');
    const [showCitySuggestions, setShowCitySuggestions] = useState<boolean>(false);
    const cityInputRef = React.useRef<HTMLDivElement>(null);

    // Close suggestions when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
                setShowCitySuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialize citySearch with the selected city label
    React.useEffect(() => {
        if (formData.city && !citySearch) {
            // First try to find by value
            let selectedCity = CANADIAN_CITIES.find((city) => city.value === formData.city);
            
            // If not found, try to find by label (for backward compatibility with old data)
            if (!selectedCity) {
                selectedCity = CANADIAN_CITIES.find((city) => city.label === formData.city);
                // If found by label, update formData to use the proper value
                if (selectedCity) {
                    updateFormData({ city: selectedCity.value });
                }
            }
            
            if (selectedCity) {
                setCitySearch(selectedCity.label);
            } else {
                // If still not found, extract city name without province suffix for display
                const cityWithoutProvince = formData.city.replace(/, [A-Z]{2}$/, '');
                setCitySearch(cityWithoutProvince);
            }
        }
    }, [formData.city, citySearch]);

    // Filter cities based on search
    const filteredCities = CANADIAN_CITIES.filter((city) => city.label.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 10); // Show max 10 results

    const handleInputChange = (field: string, value: unknown) => {
        updateFormData({ [field]: value });
    };

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Update form data
            handleInputChange('profile_photo', file);
        }
    };

    const calculateAge = (birthDate: string): number => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    const isValidAge = formData.date_of_birth ? calculateAge(formData.date_of_birth) >= 16 : true;

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#FCF2F0' }}>
                    <User className="h-8 w-8" style={{ color: '#10B3D6' }} />
                </div>
                <h2 className="mb-2 text-xl font-bold" style={{ color: '#192341' }}>
                    Welcome to SkillOnCall!
                </h2>
                <p className="text-sm text-gray-600">
                    Let's start by getting to know you better. This information helps employers find and trust you.
                </p>
            </div>

            {/* Profile Photo Upload */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                        <Camera className="mr-2 h-5 w-5" style={{ color: '#10B3D6' }} />
                        Profile Photo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                        {/* Photo Preview */}
                        <div className="relative">
                            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-gray-200 bg-gray-100">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <User className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upload Button */}
                        <div className="text-center">
                            <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                            <label htmlFor="photo-upload">
                                <Button type="button" variant="outline" className="cursor-pointer" asChild style={{ height: '2.7em' }}>
                                    <span className="flex items-center">
                                        <Upload className="mr-2 h-4 w-4" />
                                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                                    </span>
                                </Button>
                            </label>
                            <p className="mt-2 text-xs text-gray-500">Clear photos get better job opportunities</p>
                        </div>
                    </div>
                    {validationErrors.profile_photo && <p className="mt-2 text-center text-sm text-red-600">{validationErrors.profile_photo}</p>}
                </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ValidatedInput
                            id="first_name"
                            label="First Name"
                            fieldType="name"
                            value={formData.first_name || ''}
                            onChange={(value) => handleInputChange('first_name', value)}
                            error={validationErrors.first_name}
                            required
                            placeholder="Enter your first name"
                        />

                        <ValidatedInput
                            id="last_name"
                            label="Last Name"
                            fieldType="name"
                            value={formData.last_name || ''}
                            onChange={(value) => handleInputChange('last_name', value)}
                            error={validationErrors.last_name}
                            required
                            placeholder="Enter your last name"
                        />
                    </div>

                    {/* Phone Number & Date of Birth */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ValidatedInput
                            id="phone"
                            label="Phone Number"
                            fieldType="phone"
                            value={formData.phone || ''}
                            onChange={(value) => handleInputChange('phone', value)}
                            error={validationErrors.phone}
                            helperText="Employers will use this to contact you"
                            required
                            placeholder="(416) 555-0123"
                        />

                        <div>
                            <ValidatedInput
                                id="date_of_birth"
                                label="Date of Birth"
                                fieldType="date"
                                value={formData.date_of_birth || ''}
                                onChange={(value) => handleInputChange('date_of_birth', value)}
                                error={validationErrors.date_of_birth}
                                required
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {formData.date_of_birth && (
                                <p className={`mt-1 text-xs ${isValidAge ? 'text-gray-500' : 'text-red-600'}`}>
                                    Age: {calculateAge(formData.date_of_birth)} years
                                    {!isValidAge && ' (Must be at least 16 years old)'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Brief Description */}
                    <ValidatedTextarea
                        id="bio"
                        label="Tell Us About Yourself (Optional)"
                        fieldType="bio"
                        value={formData.bio || ''}
                        onChange={(value) => handleInputChange('bio', value)}
                        error={validationErrors.bio}
                        helperText="This helps employers understand your background"
                        className="h-20"
                        placeholder="Briefly describe your experience and what makes you great at your job..."
                    />
                </CardContent>
            </Card>

            {/* Canadian Legal Requirements */}
            <Card className="border bg-orange-50" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg text-orange-800">
                        <Shield className="mr-2 h-5 w-5" />
                        Work Authorization (Required by Canadian Law)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3 rounded-lg bg-orange-100 p-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />
                        <div>
                            <p className="text-sm font-medium text-orange-800">Canadian employers are required by law to verify work authorization</p>
                            <p className="mt-1 text-xs text-orange-700">This information is kept secure and only shared with employers when needed</p>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="work_authorization" className="text-sm font-medium">
                            Work Authorization Status *
                        </Label>
                        <Select value={formData.work_authorization || ''} onValueChange={(value) => handleInputChange('work_authorization', value)}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select your work status" />
                            </SelectTrigger>
                            <SelectContent>
                                {WORK_AUTHORIZATION_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {validationErrors.work_authorization && <p className="mt-1 text-sm text-red-600">{validationErrors.work_authorization}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Address Information</CardTitle>
                    <p className="text-sm text-gray-600">This helps employers find workers in their area</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Street Address */}
                    <ValidatedInput
                        id="address_line_1"
                        label="Street Address"
                        fieldType="address"
                        value={formData.address_line_1 || ''}
                        onChange={(value) => handleInputChange('address_line_1', value)}
                        error={validationErrors.address_line_1}
                        required
                        placeholder="123 Main Street"
                    />

                    {/* Apartment/Unit (Optional) */}
                    <ValidatedInput
                        id="address_line_2"
                        label="Apartment/Unit (Optional)"
                        fieldType="address"
                        value={formData.address_line_2 || ''}
                        onChange={(value) => handleInputChange('address_line_2', value)}
                        placeholder="Apt 4B, Unit 101, etc."
                    />

                    {/* Province, City, Postal Code */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <Label htmlFor="province" className="text-sm font-medium">
                                Province *
                            </Label>
                            <Select value={formData.province || ''} onValueChange={(value) => handleInputChange('province', value)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CANADIAN_PROVINCES.map((province) => (
                                        <SelectItem key={province.value} value={province.value}>
                                            {province.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {validationErrors.province && <p className="mt-1 text-sm text-red-600">{validationErrors.province}</p>}
                        </div>

                        <div ref={cityInputRef} className="relative">
                            <Label htmlFor="city" className="text-sm font-medium">
                                City *
                            </Label>
                            <div className="relative mt-1">
                                <Input
                                    id="city"
                                    type="text"
                                    value={citySearch || formData.city || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCitySearch(value);
                                        setShowCitySuggestions(true);
                                        // If user clears the input, clear the city
                                        if (!value) {
                                            handleInputChange('city', '');
                                        }
                                    }}
                                    onFocus={() => setShowCitySuggestions(true)}
                                    placeholder="Type to search cities..."
                                    className={validationErrors.city ? 'border-red-500' : ''}
                                />

                                {/* Suggestions dropdown */}
                                {showCitySuggestions && filteredCities.length > 0 && (
                                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                                        {filteredCities.map((city) => (
                                            <div
                                                key={city.value}
                                                className="cursor-pointer px-3 py-2 font-medium text-gray-900 hover:bg-gray-100"
                                                onClick={() => {
                                                    handleInputChange('city', city.value);
                                                    setCitySearch(city.label);
                                                    setShowCitySuggestions(false);
                                                }}
                                            >
                                                {city.label}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* No results message */}
                                {showCitySuggestions && citySearch && filteredCities.length === 0 && (
                                    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
                                        No cities found matching "{citySearch}"
                                    </div>
                                )}
                            </div>
                            {validationErrors.city && <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>}
                        </div>

                        <ValidatedInput
                            id="postal_code"
                            label="Postal Code"
                            fieldType="postalCode"
                            value={formData.postal_code || ''}
                            onChange={(value) => handleInputChange('postal_code', value.toUpperCase())}
                            error={validationErrors.postal_code}
                            required
                            placeholder="K1A 0A6"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Emergency Contact</CardTitle>
                    <p className="text-sm text-gray-600">Someone we can contact if there's an emergency while you're working</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ValidatedInput
                            id="emergency_contact_name"
                            label="Contact Name"
                            fieldType="name"
                            value={formData.emergency_contact_name || ''}
                            onChange={(value) => handleInputChange('emergency_contact_name', value)}
                            error={validationErrors.emergency_contact_name}
                            required
                            placeholder="Full name"
                        />

                        <ValidatedInput
                            id="emergency_contact_relationship"
                            label="Relationship"
                            fieldType="name"
                            value={formData.emergency_contact_relationship || ''}
                            onChange={(value) => handleInputChange('emergency_contact_relationship', value)}
                            error={validationErrors.emergency_contact_relationship}
                            required
                            placeholder="Parent, Spouse, Sibling, Friend"
                        />
                    </div>

                    <ValidatedInput
                        id="emergency_contact_phone"
                        label="Phone Number"
                        fieldType="phone"
                        value={formData.emergency_contact_phone || ''}
                        onChange={(value) => handleInputChange('emergency_contact_phone', value)}
                        error={validationErrors.emergency_contact_phone}
                        required
                        placeholder="(416) 555-0123"
                    />
                </CardContent>
            </Card>

            {/* Privacy Notice */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start space-x-3">
                    <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div className="text-sm">
                        <p className="mb-1 font-medium text-blue-800">Your Privacy is Protected</p>
                        <p className="text-xs text-blue-700">
                            We keep your personal information secure and only share necessary details with employers when you apply for jobs. You
                            control what information is visible in your profile.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
