import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { MoveLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';

import { toast } from 'sonner';

export default function AddInventory() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Medicine',
        quantity: 0,
        unit: 'Tablets',
        unitPrice: 0,
        supplier: '',
        expiryDate: '',
        lowStockThreshold: 10
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/inventory', formData);
            toast.success("Inventory item added successfully!");
            navigate('/inventory');
        } catch (err) {
            console.error("Failed to add inventory item", err);
            toast.error("Failed to add inventory item");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate('/inventory')}>
                    <MoveLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Add Inventory Item</h2>
                    <p className="text-gray-500">Register new stock or medicine.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Item Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Item Name</label>
                                    <Input name="name" value={formData.name} onChange={handleChange} required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <select
                                        name="category"
                                        className="flex h-10 w-full rounded-md border border-neutral-light bg-secondary px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option>Medicine</option>
                                        <option>Equipment</option>
                                        <option>Consumables</option>
                                        <option>Surgical</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Quantity</label>
                                    <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Unit</label>
                                    <Input name="unit" value={formData.unit} onChange={handleChange} placeholder="e.g. Tablets, Boxes" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Unit Price ($)</label>
                                    <Input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Supplier</label>
                                    <Input name="supplier" value={formData.supplier} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Expiry Date</label>
                                    <Input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Low Stock Threshold</label>
                                    <Input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/inventory')}>Cancel</Button>
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" /> Save Item
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    );
}
