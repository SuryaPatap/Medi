import React from 'react';
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export function Header() {
    const { user, logout, updateRole } = useAuth();
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-light bg-white px-6">
            {/* Search Bar */}
            <div className="flex w-full max-w-md items-center gap-2">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        className="pl-9 bg-secondary border-transparent focus:bg-white focus:border-primary"
                        placeholder="Search patients, doctors, records..."
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
                </Button>
                <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5 text-gray-600" />
                </Button>
                <div className="h-8 w-px bg-neutral-light" />
                <div className="flex items-center gap-2 relative group">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-sm font-medium">{user?.role === 'admin' ? 'Kindred Hospital' : 'Staff Member'}</span>
                        <span className="text-xs text-gray-500 capitalize">{user?.role} View</span>
                    </div>
                    <div className="relative">
                        <Button variant="outline" size="sm" className="hidden md:flex gap-1 group-hover:bg-gray-50">
                            Switch <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                        </Button>
                        <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-md border border-neutral-light bg-white py-1 shadow-xl group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
                            {['admin', 'doctor', 'nurse', 'receptionist', 'billing', 'executive'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => updateRole(r)}
                                    className={`flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-neutral-light capitalize ${user?.role === r ? 'font-bold text-primary bg-primary/5' : 'text-gray-700'
                                        }`}
                                >
                                    {r} {user?.role === r && '✓'}
                                </button>
                            ))}
                            <div className="my-1 border-t border-neutral-light" />
                            <button
                                onClick={logout}
                                className="flex w-full items-center px-4 py-2 text-sm text-danger hover:bg-danger/5"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
