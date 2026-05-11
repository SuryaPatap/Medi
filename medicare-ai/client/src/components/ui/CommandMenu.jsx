import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Calendar, FileText, Settings, LayoutDashboard, X, Command } from 'lucide-react';
import api from '../../api/axios';

export function CommandMenu({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleSearch = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await api.get('/patients');
                const patients = res.data.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p._id.toLowerCase().includes(query.toLowerCase())
                ).map(p => ({
                    id: p._id,
                    title: p.name,
                    subtitle: `Patient ID: ${p._id}`,
                    icon: User,
                    type: 'patient',
                    path: `/patients/${p._id}`
                }));

                // Static Nav Items
                const navItems = [
                    { title: 'Dashboard', path: '/', icon: LayoutDashboard, type: 'nav' },
                    { title: 'Appointments', path: '/appointments', icon: Calendar, type: 'nav' },
                    { title: 'EMR Systems', path: '/emr', icon: FileText, type: 'nav' },
                    { title: 'Settings', path: '/settings', icon: Settings, type: 'nav' },
                ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

                setResults([...navItems, ...patients].slice(0, 8));
            } catch (err) {
                console.error("Search error", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(handleSearch, 300);
        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 sm:px-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden animate-in slide-in-from-top-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Bar */}
                <div className="flex items-center px-4 py-4 border-b border-gray-100">
                    <Search className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for patients, pages, or actions... (Cmd+K)"
                        className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto py-2">
                    {query.length < 2 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            <Command className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-medium">Type to start searching...</p>
                            <p className="text-xs opacity-60 mt-1">Try "John" or "Dashboard"</p>
                        </div>
                    ) : loading ? (
                        <div className="p-12 text-center text-gray-500 animate-pulse">
                            Searching clinical records...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-1 px-2">
                            {results.map((item, idx) => (
                                <button
                                    key={idx}
                                    className="w-full flex items-center p-3 rounded-lg hover:bg-primary/5 group transition-all text-left"
                                    onClick={() => {
                                        navigate(item.path);
                                        onClose();
                                    }}
                                >
                                    <div className="p-2 bg-gray-50 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors mr-4">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-primary leading-tight">{item.title}</h4>
                                        {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-primary opacity-50 px-2 py-1 bg-gray-100 rounded">
                                        {item.type}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            No results found for "{query}"
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">Enter</kbd> to select</span>
                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">Esc</kbd> to close</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary/60">
                        <Command className="h-3 w-3" /> MediFlow AI Magic Search
                    </div>
                </div>
            </div>
        </div>
    );
}
