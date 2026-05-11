import React, { useState, useEffect } from 'react';
import { Clock, User, Bell } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export default function Queue() {
    const [currentTicket, setCurrentTicket] = useState({ number: 'A-102', counter: 1 });
    const [nextTickets, setNextTickets] = useState(['A-103', 'B-041', 'A-104']);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Update clock
        const timer = setInterval(() => setTime(new Date()), 1000);

        // Simulate queue movement
        const queueTimer = setInterval(() => {
            setNextTickets(prev => {
                const next = prev[0]; // Take first waiting
                setCurrentTicket(curr => ({ number: next, counter: Math.floor(Math.random() * 5) + 1 }));

                // Generate new ticket at end
                const newTicket = String.fromCharCode(65 + Math.floor(Math.random() * 2)) + '-' + Math.floor(Math.random() * 900 + 100);
                return [...prev.slice(1), newTicket];
            });

            // "Ding" sound effect could go here
        }, 8000); // Change every 8 seconds

        return () => {
            clearInterval(timer);
            clearInterval(queueTimer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b border-slate-700 pb-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center">
                        <User className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">MediFlow Queue</h1>
                        <p className="text-slate-400 text-xl text-left">General Outpatient Department</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-3xl font-mono bg-slate-800 px-6 py-3 rounded-xl border border-slate-700 shadow-lg">
                    <Clock className="h-8 w-8 text-blue-400" />
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-250px)]">

                {/* Now Serving (Big) */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 border-none shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 pattern-dots"></div>
                    <CardContent className="flex flex-col items-center justify-center h-full text-center p-10 z-10 relative">
                        <h2 className="text-4xl uppercase tracking-widest font-semibold text-blue-100 mb-8 animate-pulse text-left w-full pl-20">Now Serving</h2>
                        <div className="text-[12rem] font-bold leading-none tracking-tighter drop-shadow-lg text-left w-full pl-20">
                            {currentTicket.number}
                        </div>
                        <div className="mt-12 bg-white/20 backdrop-blur-md px-12 py-4 rounded-full text-4xl text-left pl-12 pr-12 w-fit self-start ml-20">
                            Counter <span className="font-bold text-yellow-300">{currentTicket.counter}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Up Next List */}
                <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 flex flex-col shadow-xl">
                    <h2 className="text-3xl text-slate-400 mb-8 flex items-center gap-3">
                        <Bell className="h-6 w-6" /> Up Next
                    </h2>
                    <div className="flex-1 space-y-4">
                        {nextTickets.map((ticket, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-700/50 p-6 rounded-2xl border border-slate-600 animate-in slide-in-from-right fade-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                <span className="text-4xl font-mono font-semibold">{ticket}</span>
                                <span className="text-slate-400 text-xl">Wait: ~{(i + 1) * 5}m</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto pt-8 border-t border-slate-700 text-center text-slate-500">
                        Please have your ID ready.
                    </div>
                </div>
            </div>
        </div>
    );
}
