import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Users, Calendar, Stethoscope, FileText,
    CreditCard, Shield, Package, BarChart3, Brain, Bell, Settings,
    Activity, Menu, X, FlaskConical
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'doctor', 'nurse', 'receptionist', 'billing', 'executive'] },
    { name: 'Patients', path: '/patients', icon: Users, roles: ['admin', 'doctor', 'nurse', 'receptionist', 'executive'] },
    { name: 'Appointments', path: '/appointments', icon: Calendar, roles: ['admin', 'doctor', 'nurse', 'receptionist', 'executive'] },
    { name: 'Doctors & Staff', path: '/staff', icon: Stethoscope, roles: ['admin', 'receptionist', 'executive'] },
    { name: 'Records (EMR)', path: '/emr', icon: FileText, roles: ['admin', 'doctor', 'nurse', 'executive'] },
    { name: 'Billing', path: '/billing', icon: CreditCard, roles: ['admin', 'billing', 'executive'] },
    { name: 'Insurance', path: '/insurance', icon: Shield, roles: ['admin', 'billing', 'executive'] },
    { name: 'Inventory', path: '/inventory', icon: Package, roles: ['admin', 'billing', 'executive'] },
    { name: 'Laboratory', path: '/lab', icon: FlaskConical, roles: ['admin', 'doctor', 'nurse', 'executive'] },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['admin', 'doctor', 'billing', 'executive'] },
    { name: 'AI Insights', path: '/ai-insights', icon: Brain, roles: ['admin', 'doctor', 'executive'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['admin', 'doctor', 'nurse', 'receptionist', 'billing', 'executive'] },
];

export function Sidebar() {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Filter items by role
    const filteredNavItems = navItems.filter(item =>
        item.roles.includes(user?.role || 'admin')
    );

    return (
        <>
            {/* ... (Mobile Overlay unchanged) ... */}
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            {/* Sidebar Container */}
            {/* Sidebar Container */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 md:relative",
                collapsed ? "w-20" : "w-64",
                mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Logo Header */}
                <div className="flex h-16 items-center justify-between border-b border-neutral-light px-4">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                            <Activity className="h-5 w-5" />
                        </div>
                        {!collapsed && (
                            <span className="whitespace-nowrap text-lg font-bold text-gray-900">
                                MediFlow AI
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden rounded-md p-1 hover:bg-neutral-light md:block"
                    >
                        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="block md:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
                    {filteredNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mx-2",
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                                collapsed && "justify-center px-2 mx-1"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 shrink-0", collapsed && "size-6")} />
                            {!collapsed && <span>{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer User Profile */}
                <div className="border-t border-neutral-light p-4">
                    <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        {!collapsed && (
                            <div className="overflow-hidden">
                                <p className="truncate text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                                <p className="truncate text-xs text-gray-500 capitalize">{user?.role || 'Staff'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
