import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Search, Filter, MoreHorizontal, FileText, Eye, Edit, X, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { toast } from 'sonner';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [editingPatient, setEditingPatient] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await api.get('/patients');
            if (res.data) {
                // Transform for UI
                const formatted = res.data.map(p => ({
                    ...p,
                    id: p._id.substring(p._id.length - 6).toUpperCase(),
                    age: p.dob ? new Date().getFullYear() - new Date(p.dob).getFullYear() : (p.age || 'N/A')
                }));
                setPatients(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch patients", err);
            // Demo data fallback
            setPatients([
                { _id: '1', id: 'PT-089', name: 'Sarah Connor', age: 45, gender: 'Female', phone: '(555) 123-4567', status: 'Active', lastVisit: '2023-10-15' },
                { _id: '2', id: 'PT-092', name: 'James Howlett', age: 32, gender: 'Male', phone: '(555) 987-6543', status: 'Active', lastVisit: '2023-10-20' },
                { _id: '3', id: 'PT-104', name: 'Diana Prince', age: 28, gender: 'Female', phone: '(555) 456-7890', status: 'Inactive', lastVisit: '2023-09-05' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleEditClick = (patient) => {
        setEditingPatient({ ...patient });
        setIsEditModalOpen(true);
    };

    const handleUpdatePatient = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/patients/${editingPatient._id}`, editingPatient);
            toast.success("Patient updated successfully!");
            setIsEditModalOpen(false);
            fetchPatients(); // Refetch
        } catch (err) {
            console.error("Failed to update patient", err);
            toast.error("Failed to update patient details.");
        }
    };

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (patient.id && patient.id.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header ... same as before ... */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Patients</h2>
                    <p className="text-gray-500">Manage patient records and clinical history.</p>
                </div>
                <Link to="/patients/add">
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-md">
                        <Plus className="mr-2 h-4 w-4" /> Add Patient
                    </Button>
                </Link>
            </div>

            <Card className="border-neutral-light shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="text-lg font-semibold">Patient Directory</CardTitle>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search by name or ID..."
                                    className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    className="h-10 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Critical">Critical</option>
                                </select>
                                <Button variant="outline" size="icon" className="shrink-0">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[100px]">Patient ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Age / Gender</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Last Visit</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <TableRow key={i}>
                                        <TableCell><div className="h-4 w-16 bg-gray-100 animate-pulse rounded"></div></TableCell>
                                        <TableCell>
                                            <div className="h-4 w-32 bg-gray-100 animate-pulse rounded mb-1"></div>
                                            <div className="h-3 w-24 bg-gray-50 animate-pulse rounded"></div>
                                        </TableCell>
                                        <TableCell><div className="h-4 w-20 bg-gray-50 animate-pulse rounded"></div></TableCell>
                                        <TableCell><div className="h-4 w-24 bg-gray-50 animate-pulse rounded"></div></TableCell>
                                        <TableCell><div className="h-4 w-20 bg-gray-50 animate-pulse rounded"></div></TableCell>
                                        <TableCell><div className="h-6 w-16 bg-gray-100 animate-pulse rounded-full"></div></TableCell>
                                        <TableCell className="text-right"><div className="h-8 w-16 ml-auto bg-gray-50 animate-pulse rounded"></div></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredPatients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                                        No patients found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <TableRow key={patient._id} className="group cursor-pointer hover:bg-neutral-light/30">
                                        <TableCell className="font-medium text-gray-900">{patient.id}</TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-gray-900">{patient.name}</div>
                                            <div className="text-xs text-gray-500">{patient.email || 'No email'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="capitalize">{patient.age} / {patient.gender}</span>
                                        </TableCell>
                                        <TableCell>{patient.phone}</TableCell>
                                        <TableCell>{patient.lastVisit || 'N/A'}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={patient.status} />
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => navigate(`/patients/${patient._id}`)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" /> View
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10"
                                                onClick={(e) => { e.stopPropagation(); handleEditClick(patient); }}
                                            >
                                                <Edit className="h-4 w-4 mr-1" /> Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Patient Modal */}
            {isEditModalOpen && editingPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">Edit Patient Details</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleUpdatePatient}>
                            <div className="p-6 grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input
                                        value={editingPatient.name}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input
                                        value={editingPatient.phone}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        value={editingPatient.email || ''}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <select
                                        className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                        value={editingPatient.status}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Address</label>
                                    <Input
                                        value={editingPatient.address || ''}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                                    />
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
