import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MoveRight, Activity } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // NOTE: In a real app, the email/password determines the role.
        // For this demo, we're passing role if needed or assuming it's linked to the email.
        const res = await login(email, password, role);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-outfit">
            <Card className="w-full max-w-md shadow-2xl border-none ring-1 ring-black/5">
                <CardHeader className="space-y-1 text-center pb-8">
                    <div className="flex justify-center mb-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl transform hover:scale-105 transition-transform">
                            <Activity className="h-9 w-9" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900">MediFlow AI</CardTitle>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Enterprise Hospital Portal</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <Input
                                type="email"
                                placeholder="name@hospital.com"
                                className="h-11 bg-gray-50/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="h-11 bg-gray-50/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Login Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="flex h-11 w-full items-center justify-between rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="admin">Administrator (Full Access)</option>
                                <option value="executive">System Executive (All Modules)</option>
                                <option value="doctor">Doctor (Clinical Focus)</option>
                                <option value="nurse">Nurse (Monitoring Focus)</option>
                                <option value="receptionist">Receptionist (Scheduling Focus)</option>
                                <option value="billing">Billing Staff (Financial Focus)</option>
                            </select>
                            <p className="text-[10px] text-gray-400 italic mt-1">Select role for demo purposes (API sync enabled)</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-100 flex items-center gap-2">
                                <Activity className="h-4 w-4 rotate-90" />
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg hover:shadow-blue-500/20">
                            Sign In to Dashboard <MoveRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="text-center pt-2">
                            <button type="button" className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors">
                                Forgot password?
                            </button>
                        </div>

                        {/* Temporary Demo Quick Access */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Demo Access</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {[
                                    { label: 'Admin', role: 'admin', email: 'admin@mediflow.com' },
                                    { label: 'Doctor', role: 'doctor', email: 'doctor@mediflow.com' },
                                    { label: 'Nurse', role: 'nurse', email: 'nurse@mediflow.com' },
                                    { label: 'Lab', role: 'executive', email: 'lab@mediflow.com' },
                                    { label: 'Billing', role: 'billing', email: 'billing@mediflow.com' },
                                    { label: 'Executive', role: 'executive', email: 'executive@mediflow.com' }
                                ].map((demo) => (
                                    <Button
                                        key={demo.role}
                                        type="button"
                                        variant="outline"
                                        className="h-8 px-3 text-[11px] border-gray-200 hover:bg-gray-50 hover:text-blue-600 font-semibold"
                                        onClick={async () => {
                                            const res = await login(demo.email, 'admin123', demo.role);
                                            if (res.success) navigate('/');
                                            else setError(`Demo login failed: ${res.error}`);
                                        }}
                                    >
                                        {demo.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Premium Background */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
            </div>
        </div>
    );
}
