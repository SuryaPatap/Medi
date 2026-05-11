import React, { useState, useEffect } from 'react';
import { FlaskConical, Plus, Search, FileBarChart, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { toast } from 'sonner';

export default function Lab() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Mock Data Generator
    useEffect(() => {
        // Simulate API Fetch
        setTimeout(() => {
            setTests([
                { id: 'LAB-001', patient: 'John Doe', test: 'Complete Blood Count (CBC)', status: 'Completed', date: '2023-11-20', result: 'Normal' },
                { id: 'LAB-002', patient: 'Jane Smith', test: 'Lipid Profile', status: 'Pending', date: '2023-11-21', result: '-' },
                { id: 'LAB-003', patient: 'Robert Johnson', test: 'Blood Sugar (Fasting)', status: 'Pending', date: '2023-11-21', result: '-' },
                { id: 'LAB-004', patient: 'Emily Davis', test: 'Thyroid Function Test', status: 'Completed', date: '2023-11-19', result: 'Abnormal' },
                { id: 'LAB-005', patient: 'Michael Brown', test: 'Urinalysis', status: 'In Progress', date: '2023-11-21', result: '-' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const handleAddTest = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTest = {
            id: `LAB-00${tests.length + 1}`,
            patient: formData.get('patientName'),
            test: formData.get('testName'),
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
            result: '-'
        };
        setTests([newTest, ...tests]);
        setShowAddModal(false);
        toast.success("Test Request Created");
    };

    const handleUpdateStatus = (id, newStatus) => {
        setTests(tests.map(t => t.id === id ? { ...t, status: newStatus } : t));
        toast.success(`Status updated to ${newStatus}`);
    };

    const filteredTests = tests.filter(t =>
        t.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.test.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Laboratory</h2>
                    <p className="text-gray-500">Manage test requests and enter results.</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" /> New Test Request
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <FlaskConical className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tests.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tests.filter(t => t.status === 'Pending').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tests.filter(t => t.status === 'Completed').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical/Abnormal</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tests.filter(t => t.result === 'Abnormal').length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Test Requests Queue</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search patient or test..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Patient</th>
                                        <th className="px-6 py-3">Test Name</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTests.map((test) => (
                                        <tr key={test.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{test.id}</td>
                                            <td className="px-6 py-4">{test.patient}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FileBarChart className="h-4 w-4 text-blue-500" />
                                                    {test.test}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{test.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${test.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        test.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                                                            'bg-blue-100 text-blue-800'}`}>
                                                    {test.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                {test.status !== 'Completed' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                                        onClick={() => handleUpdateStatus(test.id, 'Completed')}
                                                    >
                                                        <CheckCircle className="h-3 w-3 mr-1" /> Mark Done
                                                    </Button>
                                                )}
                                                {test.status === 'Completed' && (
                                                    <Button size="sm" variant="ghost" disabled>
                                                        View Report
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredTests.length === 0 && (
                                <div className="text-center py-8 text-gray-500">No tests found matching your search.</div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Test Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-bold mb-4">Request New Lab Test</h3>
                        <form onSubmit={handleAddTest} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Patient Name</label>
                                <Input name="patientName" required placeholder="Select Patient..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Test Type</label>
                                <select name="testName" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                    <option>Complete Blood Count (CBC)</option>
                                    <option>Lipid Profile</option>
                                    <option>Blood Sugar (Fasting)</option>
                                    <option>Thyroid Function Test</option>
                                    <option>Urinalysis</option>
                                    <option>Liver Function Test</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                                <Button type="submit">Submit Request</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
