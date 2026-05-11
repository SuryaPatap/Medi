import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MoveLeft, Save, User, Mail, Phone, Briefcase, Building } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { toast } from 'sonner';

export default function AddStaff() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Doctor',
        department: '',
        phone: '',
        specialization: '',
        status: 'Active'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/staff', formData);
            // Simulate delay for UX
            setTimeout(() => {
                toast.success("Staff member added successfully!");
                navigate('/staff');
            }, 500);
        } catch (err) {
            console.error("Failed to add staff", err);
            toast.error(err.response?.data?.msg || "Failed to add staff member. Please check fields.");
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/staff')} className="rounded-full h-10 w-10 hover:bg-gray-100">
                    <MoveLeft className="h-5 w-5 text-gray-600" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Add Staff Member</h2>
                    <p className="text-gray-500">Onboard a new employee to the system.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <Card className="border-neutral-light shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-primary" />
                                Personal & Professional Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input name="name" value={formData.name} onChange={handleChange} required className="pl-9" placeholder="e.g. Dr. John Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input type="email" name="email" value={formData.email} onChange={handleChange} required className="pl-9" placeholder="john.doe@mediflow.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input name="phone" value={formData.phone} onChange={handleChange} required className="pl-9" placeholder="(555) 000-0000" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Role <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <select
                                            name="role"
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                                            value={formData.role}
                                            onChange={handleChange}
                                        >
                                            <option>Doctor</option>
                                            <option>Nurse</option>
                                            <option>Receptionist</option>
                                            <option>Admin</option>
                                            <option>Pharmacist</option>
                                            <option>Lab Technician</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input name="department" value={formData.department} onChange={handleChange} required className="pl-9" placeholder="e.g. Cardiology, Pediatrics" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Specialization (Optional)</label>
                                    <Input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Pediatric Surgery" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Employment Status</label>
                                    <select
                                        name="status"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option>Active</option>
                                        <option>On Leave</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/staff')}>Cancel</Button>
                        <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-white min-w-[140px]">
                            {submitting ? 'Saving...' : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Staff Member
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
