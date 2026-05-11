import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MoveLeft, Save, Trash2, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';

export default function CreateInvoice() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        patient: '',
        paymentMethod: 'None',
        status: 'Pending',
        dueDate: ''
    });

    const [items, setItems] = useState([
        { description: 'Consultation Fee', cost: 50, quantity: 1 }
    ]);

    useEffect(() => {
        // Fetch patients
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/patients', {
                    headers: { 'x-auth-token': token }
                });
                if (res.data) setPatients(res.data);
            } catch (err) { console.error(err); }
        };
        fetchPatients();
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', cost: 0, quantity: 1 }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (Number(item.cost) * Number(item.quantity)), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                items,
                totalAmount: calculateTotal()
            };

            await axios.post('http://localhost:5000/api/billing', payload, {
                headers: { 'x-auth-token': token }
            });
            alert("Invoice created successfully!");
            navigate('/billing');
        } catch (err) {
            console.error("Failed to create invoice", err);
            alert("Failed to create invoice.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate('/billing')}>
                    <MoveLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">New Invoice</h2>
                    <p className="text-gray-500">Create a bill for patient services.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-3">

                    {/* Main Invoice Info */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Invoice Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Description</TableHead>
                                        <TableHead>Cost ($)</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    placeholder="Service description"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={item.cost}
                                                    onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ${(Number(item.cost) * Number(item.quantity)).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4">
                                <Button type="button" variant="outline" onClick={addItem}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Item
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Patient</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-neutral-light bg-secondary px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                        value={formData.patient}
                                        onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Patient</option>
                                        {patients.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Due Date</label>
                                    <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total Due:</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-neutral-light bg-secondary px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option>Pending</option>
                                        <option>Paid</option>
                                        <option>Overdue</option>
                                    </select>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">
                                    <Save className="mr-2 h-4 w-4" /> Save Invoice
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                </div>
            </form>
        </div>
    );
}
