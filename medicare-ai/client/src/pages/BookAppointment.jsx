import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MoveLeft, Save, Calendar as CalendarIcon, Clock, User, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { toast } from 'sonner';

export default function BookAppointment() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        patient: '',
        doctor: '',
        date: '',
        time: '',
        type: 'Checkup',
        notes: ''
    });

    useEffect(() => {
        // Fetch patients for dropdown
        const fetchPatients = async () => {
            try {
                const res = await api.get('/patients');
                if (res.data) setPatients(res.data);
            } catch (err) {
                console.error("Failed to fetch patients list", err);
                // Demo data fallback
                setPatients([
                    { _id: '1', name: 'Sarah Connor', id: 'PT-089' },
                    { _id: '2', name: 'James Howlett', id: 'PT-092' },
                    { _id: '3', name: 'Diana Prince', id: 'PT-104' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/appointments', formData);
            // Simulating success feedback
            setTimeout(() => {
                toast.success("Appointment booked successfully!");
                navigate('/appointments');
            }, 500);
        } catch (err) {
            console.error("Failed to book appointment", err);
            toast.error("Failed to book appointment. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/appointments')} className="rounded-full h-10 w-10 hover:bg-gray-100">
                    <MoveLeft className="h-5 w-5 text-gray-600" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">New Appointment</h2>
                    <p className="text-gray-500">Schedule a visit for a patient.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <Card className="border-neutral-light shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                                Appointment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Select Patient <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <select
                                                name="patient"
                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                                                value={formData.patient}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Choose a patient...</option>
                                                {patients.map(p => (
                                                    <option key={p._id} value={p._id}>
                                                        {p.name} ({p.id || 'N/A'})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Assigned Doctor <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <select
                                                name="doctor"
                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                                                value={formData.doctor}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Choose a doctor...</option>
                                                <option value="Dr. Sarah Smith">Dr. Sarah Smith (Cardiology)</option>
                                                <option value="Dr. Mike Jones">Dr. Mike Jones (General)</option>
                                                <option value="Dr. Emily White">Dr. Emily White (Pediatrics)</option>
                                                <option value="Dr. Alan Grant">Dr. Alan Grant (Orthopedics)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                required
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Time <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Input
                                                type="time"
                                                name="time"
                                                value={formData.time}
                                                onChange={handleChange}
                                                required
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Appointment Type</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {['Checkup', 'Consultation', 'Follow-up', 'Emergency'].map(type => (
                                                <div
                                                    key={type}
                                                    onClick={() => setFormData({ ...formData, type })}
                                                    className={`cursor-pointer rounded-lg border p-3 text-center text-sm transition-all ${formData.type === type ? 'border-primary bg-primary/5 text-primary font-medium ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                                                >
                                                    {type}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Clinical Notes</label>
                                        <textarea
                                            name="notes"
                                            className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none"
                                            placeholder="Reason for visit, symptoms, or special instructions..."
                                            value={formData.notes}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                                    <Button type="button" variant="outline" onClick={() => navigate('/appointments')}>Cancel</Button>
                                    <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-white min-w-[120px]">
                                        {submitting ? 'Booking...' : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" /> Confirm Booking
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Sidebar */}
                <div className="hidden lg:block space-y-6">
                    <Card className="bg-blue-50/50 border-blue-100">
                        <CardHeader>
                            <CardTitle className="text-blue-900 text-lg">Doctor Availability</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <div>
                                    <p className="font-medium text-sm text-gray-900">Dr. Sarah Smith</p>
                                    <p className="text-xs text-gray-500">Available: 9 AM - 2 PM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <div>
                                    <p className="font-medium text-sm text-gray-900">Dr. Mike Jones</p>
                                    <p className="text-xs text-gray-500">Available: 11 AM - 5 PM</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Booking Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-500 space-y-2">
                            <p>• Appointments must be booked at least 2 hours in advance.</p>
                            <p>• Cancellations are allowed up to 24 hours before the scheduled time.</p>
                            <p>• Emergency slots are subject to doctor availability.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
