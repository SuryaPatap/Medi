import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, Filter, Calendar, Activity, Edit, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useNavigate } from 'react-router-dom';

const MOCK_APPOINTMENTS = [
    { _id: 'APT-001', patient: { name: 'John Doe' }, doctor: 'Dr. Sarah Smith', date: new Date().toISOString(), time: '10:00 AM', status: 'Scheduled', type: 'Checkup' },
    { _id: 'APT-002', patient: { name: 'Jane Smith' }, doctor: 'Dr. Mike Jones', date: new Date().toISOString(), time: '11:30 AM', status: 'Completed', type: 'Consultation' },
];

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await api.get('/appointments');
            if (res.data && res.data.length > 0) {
                setAppointments(res.data);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            // Fallback for demo
            setAppointments(MOCK_APPOINTMENTS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleEditClick = (apt) => {
        setEditingAppointment({ ...apt });
        setIsEditModalOpen(true);
    };

    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/appointments/${editingAppointment._id}`, editingAppointment);
            toast.success("Appointment updated!");
            setIsEditModalOpen(false);
            fetchAppointments();
        } catch (err) {
            console.error("Failed to update appointment", err);
            toast.error("Failed to update appointment details.");
        }
    };

    const filtered = appointments.filter(apt =>
        (apt.patient?.name || 'Unknown').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.doctor || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
                    <p className="text-gray-500">Manage patient visits and doctor schedules.</p>
                </div>
                <Button onClick={() => navigate('/appointments/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Appointment
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Upcoming Appointments</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search patient or doctor..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Calendar className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Date / Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reminder</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <TableRow key={i}>
                                        <TableCell><div className="h-4 w-16 bg-gray-100 animate-pulse rounded"></div></TableCell>
                                        <TableCell><div className="h-4 w-32 bg-gray-100 animate-pulse rounded"></div></TableCell>
                                        <TableCell><div className="h-4 w-32 bg-gray-100 animate-pulse rounded"></div></TableCell>
                                        <TableCell>
                                            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded mb-1"></div>
                                            <div className="h-3 w-16 bg-gray-50 animate-pulse rounded"></div>
                                        </TableCell>
                                        <TableCell><div className="h-6 w-16 bg-gray-100 animate-pulse rounded-full"></div></TableCell>
                                        <TableCell><div className="h-6 w-12 bg-gray-50 animate-pulse rounded-full"></div></TableCell>
                                        <TableCell className="text-right"><div className="h-8 w-16 ml-auto bg-gray-50 animate-pulse rounded"></div></TableCell>
                                    </TableRow>
                                ))
                            ) : filtered.length === 0 ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-8">No appointments found.</TableCell></TableRow>
                            ) : (
                                filtered.map((apt) => (
                                    <TableRow key={apt._id || apt.id}>
                                        <TableCell className="font-medium">{(apt._id || apt.id).substring(0, 8).toUpperCase()}</TableCell>
                                        <TableCell>{apt.patient?.name || 'Unknown Patient'}</TableCell>
                                        <TableCell>{apt.doctor}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{new Date(apt.date).toLocaleDateString()}</span>
                                                <span className="text-xs text-gray-500">{apt.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell><StatusBadge status={apt.status} /></TableCell>
                                        <TableCell>
                                            {apt.reminderSent ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                                    <Activity className="h-3 w-3" /> Sent
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Not Sent</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {!apt.reminderSent && apt.status === 'Scheduled' && (
                                                    <Button
                                                        variant="outline"
                                                        size="xs"
                                                        className="h-8 text-[10px] border-blue-200 text-blue-600 hover:bg-blue-50"
                                                        onClick={async () => {
                                                            try {
                                                                toast.info("Sending reminder...");
                                                                await api.put(`/appointments/${apt._id}/remind`);
                                                                toast.success("Reminder sent to patient");
                                                                fetchAppointments();
                                                            } catch (err) {
                                                                toast.error("Failed to send reminder");
                                                            }
                                                        }}
                                                    >
                                                        Remind
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" onClick={() => handleEditClick(apt)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Appointment Modal */}
            {isEditModalOpen && editingAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">Reschedule Appointment</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleUpdateAppointment}>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Patient</label>
                                    <Input value={editingAppointment.patient?.name} disabled className="bg-gray-50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">New Date</label>
                                        <Input
                                            type="date"
                                            value={editingAppointment.date.split('T')[0]}
                                            onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">New Time</label>
                                        <Input
                                            type="time"
                                            value={editingAppointment.time}
                                            onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Doctor</label>
                                    <Input
                                        value={editingAppointment.doctor}
                                        onChange={(e) => setEditingAppointment({ ...editingAppointment, doctor: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Status</label>
                                    <select
                                        className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                        value={editingAppointment.status}
                                        onChange={(e) => setEditingAppointment({ ...editingAppointment, status: e.target.value })}
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white min-w-[120px]">
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
