import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, Filter, Receipt } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useNavigate } from 'react-router-dom';

const MOCK_INVOICES = [
    { _id: 'INV-001', patient: { name: 'John Doe' }, date: '2023-11-20', totalAmount: 150, status: 'Paid', paymentMethod: 'Card' },
    { _id: 'INV-002', patient: { name: 'Jane Smith' }, date: '2023-11-21', totalAmount: 300, status: 'Pending', paymentMethod: 'None' },
];

export default function Billing() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('/billing');
            if (res.data) {
                setInvoices(res.data);
            } else {
                setInvoices([]);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
            setInvoices(MOCK_INVOICES);
        } finally {
            setLoading(false);
        }
    };

    const filteredInvoices = invoices.filter(inv =>
        (inv.patient?.name || 'Unknown').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv._id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Billing & Invoices</h2>
                    <p className="text-gray-500">Manage patient invoices and payments.</p>
                </div>
                <Button onClick={() => navigate('/billing/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Create Invoice
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Invoices</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search invoice or patient..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
                            ) : filteredInvoices.length === 0 ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-8">No invoices found.</TableCell></TableRow>
                            ) : (
                                filteredInvoices.map((inv) => (
                                    <TableRow key={inv._id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <Receipt className="h-4 w-4 text-gray-400" />
                                            {(inv._id).substring(0, 8).toUpperCase()}
                                        </TableCell>
                                        <TableCell>{inv.patient?.name || 'Unknown'}</TableCell>
                                        <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-bold">${inv.totalAmount}</TableCell>
                                        <TableCell><StatusBadge status={inv.status} /></TableCell>
                                        <TableCell>{inv.paymentMethod}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
