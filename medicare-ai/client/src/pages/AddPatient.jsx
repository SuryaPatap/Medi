import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // removed axios import
import api from '../api/axios'; // Import centralized api
import { MoveLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { toast } from 'sonner';

export default function AddPatient() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        emergencyContact: '',
        insuranceProvider: '',
        policyNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data for API
        const payload = {
            name: `${formData.firstName} ${formData.lastName}`,
            age: calculateAge(formData.dob),
            gender: formData.gender,
            phone: formData.phone,
            address: formData.address,
            email: formData.email,
            emergencyContact: formData.emergencyContact,
            insuranceProvider: formData.insuranceProvider,
            policyNumber: formData.policyNumber,
            dob: formData.dob
        };

        console.log("Submitting patient:", payload);

        try {
            await api.post('/patients', payload);
            toast.success("Patient registered successfully!");
            navigate('/patients');
        } catch (err) {
            console.error("Failed to add patient", err);
            toast.error("Failed to save patient. Check details.");
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return 0;
        const diff = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate('/patients')}>
                    <MoveLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Add Patient</h2>
                    <p className="text-gray-500">Register a new patient to the system.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Personal Info */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <Input name="firstName" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <Input name="lastName" value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date of Birth</label>
                                <Input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Gender</label>
                                <select
                                    name="gender"
                                    className="flex h-10 w-full rounded-md border border-neutral-light bg-secondary px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address</label>
                                <Input name="address" value={formData.address} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Insurance */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Insurance & Emergency</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Insurance Provider</label>
                                <Input name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Policy Number</label>
                                <Input name="policyNumber" value={formData.policyNumber} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Emergency Contact</label>
                                <Input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/patients')}>Cancel</Button>
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" /> Save Patient
                    </Button>
                </div>
            </form>
        </div>
    );
}
