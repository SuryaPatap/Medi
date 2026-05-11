import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Calendar, Phone, Mail, MapPin, Activity, FileText, Pill, AlertCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import api from '../api/axios';

const TABS = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'history', label: 'Medical History', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
];

export default function PatientProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                // Fetch real data
                const res = await api.get(`/patients/${id}`);
                if (res.data) {
                    setPatient(res.data);
                } else {
                    // Fallback/Demo if API returns null/empty
                    setPatient({
                        _id: id,
                        name: 'Sarah Connor (Demo)',
                        id: 'PT-089',
                        age: 45,
                        gender: 'Female',
                        phone: '(555) 123-4567',
                        email: 'sarah.c@example.com',
                        address: '123 Tech Blvd',
                        status: 'Active',
                        bloodType: 'O+',
                        allergies: [],
                        conditions: [],
                        lastVisit: '2023-10-15',
                        vitals: { bp: '120/80', heartRate: '72', temp: '98.6', weight: '145' }
                    });
                }
            } catch (err) {
                console.error("Error fetching patient", err);
                // Demo Data Fallback on Error
                setPatient({
                    _id: id,
                    name: 'Sarah Connor (Demo)',
                    initials: 'SC',
                    age: 45,
                    gender: 'Female',
                    phone: '(555) 123-4567',
                    email: 'sarah.c@example.com',
                    address: '123 Tech Blvd',
                    status: 'Active',
                    bloodType: 'O+',
                    allergies: ['Penicillin'],
                    conditions: ['Asthma'],
                    lastVisit: '2023-10-15',
                    vitals: { bp: '120/80', heartRate: '72', temp: '98.6', weight: '145' }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gray-500">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Loading patient profile...
                </div>
            </div>
        );
    }

    if (!patient) return <div>Patient not found</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/patients')} className="text-gray-500">
                    &larr; Back to List
                </Button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">{patient.name}</h2>
                <StatusBadge status={patient.status} />
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Left Sidebar: Patient Card */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-6">
                    <Card className="overflow-hidden border-neutral-light shadow-sm">
                        <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                        <CardContent className="pt-0 -mt-12 text-center">
                            <div className="mx-auto h-24 w-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center bg-gray-100 mb-4">
                                <User className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                            <p className="text-sm text-gray-500">{patient.id}</p>

                            <div className="mt-6 space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <User className="h-4 w-4 shrink-0" />
                                    <span>{patient.gender}, {patient.age} yrs</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{patient.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{patient.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{patient.address}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Blood Type</p>
                                    <p className="text-lg font-bold text-gray-900">{patient.bloodType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Last Visit</p>
                                    <p className="text-lg font-bold text-gray-900">{patient.lastVisit}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-light shadow-sm bg-blue-50/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-blue-900">Medical Alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-blue-700">Allergies</p>
                                <div className="flex flex-wrap gap-2">
                                    {patient.allergies.map(a => (
                                        <span key={a} className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-blue-700">Chronic Conditions</p>
                                <div className="flex flex-wrap gap-2">
                                    {patient.conditions.map(c => (
                                        <span key={c} className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Tabs & Content */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
                    {/* Tabs Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors
                                            ${isActive
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }
                                        `}
                                    >
                                        <Icon className={`-ml-0.5 mr-2 h-4 w-4 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'overview' && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader><CardTitle>Recent Vitals</CardTitle></CardHeader>
                                    <CardContent>
                                        <dl className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-2">
                                            <div className="border-l-4 border-green-500 pl-4 bg-green-50 py-2 rounded-r">
                                                <dt className="text-sm font-medium text-gray-500">Blood Pressure</dt>
                                                <dd className="mt-1 text-2xl font-semibold text-gray-900">{patient.vitals.bp}</dd>
                                            </div>
                                            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 py-2 rounded-r">
                                                <dt className="text-sm font-medium text-gray-500">Heart Rate</dt>
                                                <dd className="mt-1 text-2xl font-semibold text-gray-900">{patient.vitals.heartRate}</dd>
                                            </div>
                                            <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 py-2 rounded-r">
                                                <dt className="text-sm font-medium text-gray-500">Temperature</dt>
                                                <dd className="mt-1 text-2xl font-semibold text-gray-900">{patient.vitals.temp}</dd>
                                            </div>
                                            <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 py-2 rounded-r">
                                                <dt className="text-sm font-medium text-gray-500">Weight</dt>
                                                <dd className="mt-1 text-2xl font-semibold text-gray-900">{patient.vitals.weight}</dd>
                                            </div>
                                        </dl>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle>Upcoming Appointments</CardTitle>
                                        <Button variant="outline" size="sm">Schedule New</Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[1, 2].map((_, i) => (
                                                <div key={i} className="flex items-start gap-4 rounded-lg bg-gray-50 p-3">
                                                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-white border border-gray-200">
                                                        <span className="text-xs font-bold text-primary uppercase">Oct</span>
                                                        <span className="text-lg font-bold text-gray-900">{24 + i}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">General Checkup</p>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Clock className="h-3 w-3" /> 10:00 AM
                                                            <span className="text-gray-300">|</span>
                                                            with Dr. Wilson
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        {activeTab === 'history' && (
                            <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-dashed">
                                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                <h3 className="text-lg font-medium text-gray-900">Medical History</h3>
                                <p>No detailed history records found.</p>
                            </div>
                        )}
                        {/* Other tabs would mock similarly */}
                    </div>
                </div>
            </div>
        </div>
    );
}
