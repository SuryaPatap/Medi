import React from 'react';
import { Bell, Info, Check } from 'lucide-react';

export default function Notifications() {
    const notifications = [
        { id: 1, title: 'Medical Stock Alert', message: 'Paracetamol stock is below threshold.', time: '10 mins ago', type: 'alert' },
        { id: 2, title: 'New Appointment', message: 'Dr. Sarah has a new booking for 2:00 PM.', time: '1 hour ago', type: 'info' },
        { id: 3, title: 'System Update', message: 'MediFlow AI successfully updated to v2.1.0.', time: 'Yesterday', type: 'success' },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Notifications</h2>
            <div className="space-y-3">
                {notifications.map((n) => (
                    <div key={n.id} className="p-4 bg-white rounded-lg shadow-sm border border-neutral-light flex gap-4 items-start">
                        <div className={`p-2 rounded-full flex-shrink-0 ${n.type === 'alert' ? 'bg-red-100 text-red-600' : n.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            <Bell className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{n.title}</h3>
                            <p className="text-sm text-gray-600">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
