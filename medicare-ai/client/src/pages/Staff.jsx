import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, Search, Filter, MoreHorizontal, User, Mail, Phone, Briefcase, Building, Edit, X, Save } from 'lucide-react';
import api from '../api/axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function Staff() {
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [editingStaff, setEditingStaff] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const res = await api.get('/staff');
            if (res.data) setStaff(res.data);
        } catch (err) {
            console.error("Failed to fetch staff", err);
            // Demo data fallback
            setStaff([
                { _id: '1', name: 'Dr. Sarah Smith', role: 'Doctor', department: 'Cardiology', email: 'sarah.s@mediflow.com', phone: '(555) 123-4567', status: 'Active' },
                { _id: '2', name: 'Dr. John Doe', role: 'Doctor', department: 'Pediatrics', email: 'john.d@mediflow.com', phone: '(555) 987-6543', status: 'Active' },
                { _id: '3', name: 'Jane Wilson', role: 'Nurse', department: 'Emergency', email: 'jane.w@mediflow.com', phone: '(555) 456-7890', status: 'Active' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleEditClick = (member) => {
        setEditingStaff({ ...member });
        setIsEditModalOpen(true);
    };

    const handleUpdateStaff = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/staff/${editingStaff._id}`, editingStaff);
            toast.success("Staff details updated!");
            setIsEditModalOpen(false);
            fetchStaff();
        } catch (err) {
            console.error("Failed to update staff", err);
            toast.error("Failed to update staff member.");
        }
    };

    const filteredStaff = staff.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || member.role === roleFilter;
        const matchesDept = departmentFilter === 'All' || member.department === departmentFilter;
        return matchesSearch && matchesRole && matchesDept;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Staff Management</h2>
                    <p className="text-gray-500">View and manage hospital personnel.</p>
                </div>
                <Link to="/staff/add">
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-md">
                        <Plus className="mr-2 h-4 w-4" /> Add Staff Member
                    </Button>
                </Link>
            </div>

            <Card className="border-neutral-light shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-100">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search staff by name or email..."
                                className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all shadow-none h-10 rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="All">All Roles</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Admin">Admin</option>
                                <option value="Receptionist">Receptionist</option>
                            </select>
                            <select
                                className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                            >
                                <option value="All">All Departments</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Neurology">Neurology</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-64 rounded-xl border border-gray-100 bg-gray-50 animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredStaff.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">No staff found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredStaff.map((member) => (
                                <Card key={member._id} className="group overflow-hidden transition-all hover:shadow-lg border-gray-200 hover:border-primary/30">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <User className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{member.name}</h3>
                                                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">{member.role}</p>
                                                </div>
                                            </div>
                                            <StatusBadge status={member.status} />
                                        </div>

                                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-gray-400" />
                                                {member.department}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                {member.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                {member.phone}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1 rounded-lg">View Profile</Button>
                                            <Button variant="secondary" size="sm" className="flex-1 rounded-lg" onClick={() => handleEditClick(member)}>
                                                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Staff Modal */}
            {isEditModalOpen && editingStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Edit Staff Profile</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleUpdateStaff}>
                            <div className="p-6 grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                    <Input
                                        value={editingStaff.name}
                                        onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                                        className="h-10" required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                                    <select
                                        className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                        value={editingStaff.role}
                                        onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                                    >
                                        <option>Doctor</option>
                                        <option>Nurse</option>
                                        <option>Receptionist</option>
                                        <option>Admin</option>
                                        <option>Pharmacist</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                                    <Input
                                        value={editingStaff.department}
                                        onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                                        className="h-10" required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                                    <Input
                                        value={editingStaff.phone}
                                        onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                                        className="h-10" required
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                    <Input
                                        type="email"
                                        value={editingStaff.email}
                                        onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                                        className="h-10" required
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Employment Status</label>
                                    <select
                                        className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                        value={editingStaff.status}
                                        onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="On Leave">On Leave</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white min-w-[140px] shadow-sm">
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
