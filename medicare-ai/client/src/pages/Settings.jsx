import { Save, Lock, Smartphone, Mail, Globe, Palette } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { toast } from 'sonner';
import api from '../api/axios';

export default function Settings() {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        twoFactorAuth: false,
        theme: 'light',
        language: 'English'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [updatingPassword, setUpdatingPassword] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('userSettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            setSettings(parsed);
            applyTheme(parsed.theme);
        }
    }, []);

    const applyTheme = (theme) => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };
            if (key === 'theme') applyTheme(value);
            return newSettings;
        });
    };

    const handleSave = () => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
        toast.success("Preferences saved successfully!");
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("New passwords do not match.");
        }

        try {
            setUpdatingPassword(true);
            await api.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password updated successfully!");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error("Password update failed", err);
            toast.error(err.response?.data?.message || "Failed to update password.");
        } finally {
            setUpdatingPassword(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h2>
                <p className="text-gray-500">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" /> Notifications
                        </CardTitle>
                        <CardDescription>Configure how you receive alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <label htmlFor="email-notif" className="text-sm font-medium leading-none cursor-pointer">
                                Email Notifications
                            </label>
                            <input
                                type="checkbox"
                                id="email-notif"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={settings.emailNotifications}
                                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <label htmlFor="sms-notif" className="text-sm font-medium leading-none cursor-pointer">
                                SMS Notifications
                            </label>
                            <input
                                type="checkbox"
                                id="sms-notif"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={settings.smsNotifications}
                                onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-primary" /> Security
                        </CardTitle>
                        <CardDescription>Update your password and security settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Current Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwordData.currentPassword}
                                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase">New Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Confirm New Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" variant="outline" className="w-full text-xs h-9" disabled={updatingPassword}>
                                {updatingPassword ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                        <div className="flex items-center justify-between space-x-2 pt-4 border-t border-gray-100">
                            <label htmlFor="2fa" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-gray-400" /> Two-Factor Auth
                            </label>
                            <input
                                type="checkbox"
                                id="2fa"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={settings.twoFactorAuth}
                                onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-4 w-4 text-primary" /> Preferences
                        </CardTitle>
                        <CardDescription>Customize your workspace experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-gray-400" /> Language
                                </label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={settings.language}
                                    onChange={(e) => handleChange('language', e.target.value)}
                                >
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-gray-400" /> Interface Theme
                                </label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={settings.theme}
                                    onChange={(e) => handleChange('theme', e.target.value)}
                                >
                                    <option value="light">☀️ Light</option>
                                    <option value="dark">🌙 Dark</option>
                                    <option value="system">🖥️ System</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                            <Save className="mr-2 h-4 w-4" /> Save Preferences
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
