import React, { useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import FeedbackModal from '@/components/feedback-modal';
import { CheckCircle, Edit, MapPin, Phone, User, Shield } from 'react-feather';

type PageProps = {
  mode: 'view' | 'edit';
  profile: any;
  profileCompletion: number;
  globalSkills?: any[];
  globalIndustries?: any[];
  globalLanguages?: any[];
  globalCertifications?: any[];
};

export default function WorkerProfilePage(props: PageProps) {
  const { mode, profile, profileCompletion } = props;
  const [form, setForm] = useState<any>({ ...(profile || {}) });
  const [errors, setErrors] = useState<any>({});
  const [modal, setModal] = useState<{open:boolean; title:string; msg:string; type:'success'|'error'|'info'; details?:string[]}>({open:false, title:'', msg:'', type:'info'});

  const isView = mode === 'view';

  const onChange = (field: string, value: any) => {
    setForm((f: any) => ({ ...f, [field]: value }));
    setErrors((e: any) => ({ ...e, [field]: undefined }));
  };

  const save = async () => {
    try {
      await router.put('/worker/profile', { data: form }, {
        onError: (e) => {
          setErrors(e);
          setModal({open:true, title:'Please fix the highlighted fields', msg:'Some fields need your attention.', type:'error', details:Object.values(e).map(String).slice(0,6)});
        },
        onSuccess: () => {
          setModal({open:true, title:'Profile saved', msg:'Your profile was updated successfully.', type:'success'});
        },
        preserveScroll: true
      });
    } catch (err) {
      setModal({open:true, title:'Unexpected error', msg:'Please try again.', type:'error'});
    }
  };

  const Field = ({label, id, children, hint}:{label:string; id:string; children:React.ReactNode; hint?:string}) => (
    <div>
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <div className="mt-1">{children}</div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {errors[id] && <p className="text-xs text-red-600 mt-1">{String(errors[id])}</p>}
    </div>
  );

  return (
    <AppLayout>
      <Head title="My Profile" />
      <FeedbackModal isOpen={modal.open} onClose={() => setModal(m=>({...m,open:false}))} title={modal.title} message={modal.msg} type={modal.type} details={modal.details} />

      <div className="w-full px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{color:'#192341'}}>{isView ? 'My Profile' : 'Edit Profile'}</h1>
            <p className="text-gray-600">Keep your information accurate to get better matches.</p>
          </div>
          <div className="flex items-center gap-2">
            {profileCompletion >= 100 ? (
              <Badge className="text-white" style={{backgroundColor:'#16a34a'}}>
                <CheckCircle className="h-3 w-3 mr-1 text-white" /> 100% complete
              </Badge>
            ) : (
              <Badge variant="outline">{profileCompletion}% complete</Badge>
            )}
            {isView ? (
              <Button onClick={() => router.visit('/worker/profile/edit')} className="text-white" style={{backgroundColor:'#10B3D6', height:'2.7em'}}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            ) : (
              <Button onClick={save} className="text-white" style={{backgroundColor:'#10B3D6', height:'2.7em'}}>
                Save Changes
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><User className="h-5 w-5 mr-2" style={{color:'#10B3D6'}} />Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isView ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><div className="text-gray-500">Name</div><div className="font-medium">{form.first_name} {form.last_name}</div></div>
                    <div><div className="text-gray-500">Phone</div><div className="font-medium">{form.phone || '—'}</div></div>
                    <div className="md:col-span-2"><div className="text-gray-500">Bio</div><div className="font-medium">{form.bio || '—'}</div></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="First name" id="first_name" hint="As on your ID.">
                      <Input id="first_name" value={form.first_name||''} onChange={e=>onChange('first_name', e.target.value)} />
                    </Field>
                    <Field label="Last name" id="last_name">
                      <Input id="last_name" value={form.last_name||''} onChange={e=>onChange('last_name', e.target.value)} />
                    </Field>
                    <Field label="Phone" id="phone" hint="Mobile preferred (digits only).">
                      <Input id="phone" value={form.phone||''} onChange={e=>onChange('phone', e.target.value)} />
                    </Field>
                    <Field label="Date of birth" id="date_of_birth" hint="You must be at least 18.">
                      <Input id="date_of_birth" type="date" value={form.date_of_birth||''} onChange={e=>onChange('date_of_birth', e.target.value)} />
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Short bio" id="bio" hint="Max 500 characters. Keep it professional and friendly.">
                        <Textarea id="bio" value={form.bio||''} onChange={e=>onChange('bio', e.target.value)} className="h-24" />
                      </Field>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><MapPin className="h-5 w-5 mr-2" style={{color:'#10B3D6'}} />Address & Work Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isView ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="md:col-span-2"><div className="text-gray-500">Address</div><div className="font-medium">{form.address_line_1}{form.address_line_2?`, ${form.address_line_2}`:''}</div></div>
                    <div><div className="text-gray-500">City</div><div className="font-medium">{form.city}</div></div>
                    <div><div className="text-gray-500">Province</div><div className="font-medium">{form.province}</div></div>
                    <div><div className="text-gray-500">Postal code</div><div className="font-medium">{form.postal_code}</div></div>
                    <div><div className="text-gray-500">Hourly rate</div><div className="font-medium">${form.hourly_rate_min}{form.hourly_rate_max?` - $${form.hourly_rate_max}`:''}</div></div>
                    <div><div className="text-gray-500">Travel distance</div><div className="font-medium">{form.travel_distance_max} km</div></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Address line 1" id="address_line_1"><Input id="address_line_1" value={form.address_line_1||''} onChange={e=>onChange('address_line_1', e.target.value)} /></Field>
                      <Field label="Address line 2" id="address_line_2"><Input id="address_line_2" value={form.address_line_2||''} onChange={e=>onChange('address_line_2', e.target.value)} /></Field>
                    </div>
                    <Field label="City" id="city"><Input id="city" value={form.city||''} onChange={e=>onChange('city', e.target.value)} /></Field>
                    <Field label="Province (2-letter)" id="province" hint="Example: ON, BC, AB."><Input id="province" value={form.province||''} onChange={e=>onChange('province', e.target.value)} /></Field>
                    <Field label="Postal code" id="postal_code" hint="Format: A1A 1A1."><Input id="postal_code" value={form.postal_code||''} onChange={e=>onChange('postal_code', e.target.value)} /></Field>
                    <Field label="Minimum hourly rate" id="hourly_rate_min"><Input id="hourly_rate_min" type="number" step="0.01" value={form.hourly_rate_min||''} onChange={e=>onChange('hourly_rate_min', e.target.value)} /></Field>
                    <Field label="Maximum hourly rate" id="hourly_rate_max"><Input id="hourly_rate_max" type="number" step="0.01" value={form.hourly_rate_max||''} onChange={e=>onChange('hourly_rate_max', e.target.value)} /></Field>
                    <Field label="Max travel distance (km)" id="travel_distance_max"><Input id="travel_distance_max" type="number" value={form.travel_distance_max||''} onChange={e=>onChange('travel_distance_max', e.target.value)} /></Field>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Shield className="h-5 w-5 mr-2" style={{color:'#10B3D6'}} />Emergency & Legal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isView ? (
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Emergency contact</span><div className="font-medium">{form.emergency_contact_name} ({form.emergency_contact_relationship})</div></div>
                    <div><span className="text-gray-500">Emergency phone</span><div className="font-medium">{form.emergency_contact_phone}</div></div>
                    <div><span className="text-gray-500">Work authorization</span><div className="font-medium capitalize">{(form.work_authorization||'').replaceAll('_',' ')}</div></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Field label="Emergency contact name" id="emergency_contact_name"><Input id="emergency_contact_name" value={form.emergency_contact_name||''} onChange={e=>onChange('emergency_contact_name', e.target.value)} /></Field>
                    <Field label="Emergency contact phone" id="emergency_contact_phone"><Input id="emergency_contact_phone" value={form.emergency_contact_phone||''} onChange={e=>onChange('emergency_contact_phone', e.target.value)} /></Field>
                    <Field label="Relationship" id="emergency_contact_relationship"><Input id="emergency_contact_relationship" value={form.emergency_contact_relationship||''} onChange={e=>onChange('emergency_contact_relationship', e.target.value)} /></Field>
                    <Field label="Work authorization" id="work_authorization" hint="Choose the option that best describes your status.">
                      <Input id="work_authorization" value={form.work_authorization||''} onChange={e=>onChange('work_authorization', e.target.value)} />
                    </Field>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


