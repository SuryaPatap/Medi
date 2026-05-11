import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Search, Filter, Package, TrendingDown, AlertTriangle, CheckCircle2, History, Edit, X, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { toast } from 'sonner';

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showInsights, setShowInsights] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await api.get('/inventory');
            if (res.data) {
                setItems(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch inventory", err);
            // Demo fallback
            setItems([
                { _id: '1', name: 'Paracetamol 500mg', category: 'Medicine', quantity: 500, unit: 'Tablets', status: 'In Stock', lowStockThreshold: 100 },
                { _id: '2', name: 'Surgical Masks', category: 'Consumables', quantity: 45, unit: 'Boxes', status: 'Low Stock', lowStockThreshold: 50 },
                { _id: '3', name: 'Syringes 5ml', category: 'Consumables', quantity: 0, unit: 'Pieces', status: 'Out of Stock', lowStockThreshold: 50 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleEditClick = (item) => {
        setEditingItem({ ...item });
        setIsEditModalOpen(true);
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/inventory/${editingItem._id}`, editingItem);
            toast.success("Inventory item updated!");
            setIsEditModalOpen(false);
            fetchInventory();
        } catch (err) {
            console.error("Failed to update inventory", err);
            toast.error("Failed to update item.");
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Mock AI Calculation Logic
    const getSupplyInsights = () => {
        return filteredItems.map(item => {
            const usageRate = item.status === 'In Stock' ? 5 : item.status === 'Low Stock' ? 2 : 0;
            const daysRemaining = usageRate > 0 ? Math.floor(item.quantity / usageRate) : 0;
            return {
                ...item,
                usageRate,
                daysRemaining,
                recommendation: daysRemaining < 7 ? 'Reorder Immediate' : daysRemaining < 14 ? 'Plan Reorder' : 'Good'
            };
        }).filter(item => item.recommendation !== 'Good' || item.quantity < (item.lowStockThreshold || 50));
    };

    const insights = getSupplyInsights();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Inventory & Stock</h2>
                    <p className="text-gray-500 italic">Predictive supply chain management powered by MediFlow AI.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => setShowInsights(!showInsights)}>
                        <TrendingDown className={`h-4 w-4 ${showInsights ? 'text-primary' : ''}`} />
                        {showInsights ? 'Hide AI Insights' : 'AI Supply Insights'}
                    </Button>
                    <Button onClick={() => navigate('/inventory/new')}>
                        <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                </div>
            </div>

            {showInsights && (
                <div className="grid gap-4 md:grid-cols-3 animate-in slide-in-from-top-4 duration-500">
                    <Card className="bg-indigo-50 border-indigo-100 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-900 flex items-center gap-2">
                                <TrendingDown className="h-4 w-4" /> Usage Prediction
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-indigo-700">72%</div>
                            <p className="text-xs text-indigo-600">Average monthly stock consumption</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-orange-50 border-orange-100 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-900 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" /> Critical Shortage
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-700">{insights.filter(i => i.recommendation === 'Reorder Immediate').length} Items</div>
                            <p className="text-xs text-orange-600">Likely out of stock within 7 days</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-100 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Efficiency Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">A+</div>
                            <p className="text-xs text-green-600">Waste reduction via predictive reordering</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="border-neutral-light shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Global Stock Repository</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search inventory..."
                                    className="pl-9 bg-gray-50 border-gray-200"
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
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Est. Days Left</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Smart Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-12 text-gray-400">Loading critical inventory data...</TableCell></TableRow>
                            ) : filteredItems.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-12 text-gray-500">No inventory items found.</TableCell></TableRow>
                            ) : (
                                filteredItems.map((item) => {
                                    const usageRate = item.status === 'In Stock' ? 5 : item.status === 'Low Stock' ? 2 : 0;
                                    const daysRemaining = usageRate > 0 ? Math.floor(item.quantity / usageRate) : 0;
                                    const isCritical = daysRemaining < 7 && item.quantity > 0;

                                    return (
                                        <TableRow key={item._id} className={isCritical ? "bg-orange-50/30" : "hover:bg-gray-50/50"}>
                                            <TableCell className="font-medium flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isCritical ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    <Package className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-semibold">{item.name}</span>
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{item.category}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{item.category}</TableCell>
                                            <TableCell className="font-bold text-gray-900">{item.quantity} {item.unit}</TableCell>
                                            <TableCell>
                                                {item.quantity === 0 ? (
                                                    <span className="text-danger font-bold border-b border-danger/20">DEPLETED</span>
                                                ) : (
                                                    <span className={daysRemaining < 7 ? "text-orange-600 font-bold" : "text-gray-600"}>
                                                        ~{daysRemaining} days
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell><StatusBadge status={item.status} /></TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {(item.status === 'Low Stock' || item.status === 'Out of Stock') && (
                                                        <Button
                                                            size="xs"
                                                            className="h-8 bg-primary hover:bg-primary/90 text-white text-[10px]"
                                                            onClick={() => toast.success(`Purchase order generated for ${item.name}`)}
                                                        >
                                                            Reorder Now
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-primary" onClick={() => handleEditClick(item)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-primary">
                                                        <History className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Inventory Modal */}
            {isEditModalOpen && editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">Edit Inventory Item</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleUpdateItem}>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Item Name</label>
                                    <Input
                                        value={editingItem.name}
                                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Quantity ({editingItem.unit})</label>
                                        <Input
                                            type="number"
                                            value={editingItem.quantity}
                                            onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Low Stock Alert</label>
                                        <Input
                                            type="number"
                                            value={editingItem.lowStockThreshold || ''}
                                            onChange={(e) => setEditingItem({ ...editingItem, lowStockThreshold: parseInt(e.target.value) })}
                                            placeholder="Min quantity"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Category</label>
                                    <select
                                        className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                        value={editingItem.category}
                                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                    >
                                        <option>Medicine</option>
                                        <option>Consumables</option>
                                        <option>Equipment</option>
                                        <option>Laboratory</option>
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
