import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Shield, FileText, CheckCircle, AlertCircle, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { toast } from 'sonner';

const MOCK_CLAIMS = [
    { _id: 'CLM-001', patient: 'John Doe', provider: 'BlueCross', amount: 1500, date: '2023-11-01', status: 'Approved' },
    { _id: 'CLM-002', patient: 'Jane Smith', provider: 'Aetna', amount: 450, date: '2023-11-05', status: 'Pending' },
    { _id: 'CLM-003', patient: 'Robert Johnson', provider: 'Medicare', amount: 3200, date: '2023-11-10', status: 'Rejected' },
];

export default function Insurance() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const res = await api.get('/insurance');
            if (res.data && res.data.length > 0) {
                setClaims(res.data);
            } else {
                setClaims(MOCK_CLAIMS); // Use mock if DB empty
            }
        } catch (error) {
            console.error("Error fetching claims:", error);
            setClaims(MOCK_CLAIMS);
        } finally {
            setLoading(false);
        }
    };

    const filteredClaims = claims.filter(c =>
        c.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Insurance & Claims</h2>
                    <p className="text-gray-500">Manage patient insurance claims and approvals.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> New Claim
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white border-neutral-light shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">12</div>
                        <p className="text-xs text-gray-400 mt-1">Requiring documentation</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-neutral-light shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Claims Value</CardTitle>
                        <Shield className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">$54,230</div>
                        <p className="text-xs text-green-600 mt-1">+8% vs last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-neutral-light shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Approved Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">94%</div>
                        <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-neutral-light shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-100">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Recent Claims</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search patient or provider..."
                                    className="pl-9 bg-gray-50 border-gray-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4 text-gray-500" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Claim ID</th>
                                    <th className="px-6 py-3 font-medium">Patient</th>
                                    <th className="px-6 py-3 font-medium">Provider</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Amount</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredClaims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{claim.id}</td>
                                        <td className="px-6 py-4">{claim.patient}</td>
                                        <td className="px-6 py-4">{claim.provider}</td>
                                        <td className="px-6 py-4 text-gray-500">{claim.date}</td>
                                        <td className="px-6 py-4 font-bold">${claim.amount}</td>
                                        <td className="px-6 py-4"><StatusBadge status={claim.status} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => toast.info("Fetching claim details...")}>View</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
