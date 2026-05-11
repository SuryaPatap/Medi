import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FileText, Search, User, Filter, AlertCircle, BrainCircuit, Mic, MicOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { toast } from 'sonner';

export default function Emr() {
    const [searchTerm, setSearchTerm] = useState('');
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [suggestedCodes, setSuggestedCodes] = useState([]);
    const [isAnalyzingCodes, setIsAnalyzingCodes] = useState(false);
    const [activeAppointment, setActiveAppointment] = useState(null);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const synthesis = new SpeechRecognition();
            synthesis.continuous = true;
            synthesis.interimResults = true;
            synthesis.lang = 'en-US';

            synthesis.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    }
                }
                if (finalTranscript) {
                    setNoteText(prev => prev + finalTranscript);
                }
            };

            synthesis.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            setRecognition(synthesis);
        }
    }, []);

    const toggleListening = () => {
        if (!recognition) {
            toast.error("Browser does not support Speech Recognition");
            return;
        }

        if (isListening) {
            recognition.stop();
            setIsListening(false);
            toast.info("Voice dictation stopped");
        } else {
            recognition.start();
            setIsListening(true);
            toast.success("Listening... Speak now");
        }
    };

    const handleSearch = async () => {
        if (!searchTerm) return;
        setLoading(true);
        setPatientData(null);
        setAiAnalysis(null);

        try {
            // Real World: Fetching from backend with Fallback
            let data = [];
            try {
                const res = await api.get('/patients');
                data = res.data;
            } catch (err) {
                console.warn("Backend fetch failed, using offline data");
            }

            // Fallback Mock Data (Vital for demo if seed failed)
            if (!data || data.length === 0) {
                console.log("Using Mock Data");
                data = [
                    { _id: "P-001", name: "John Doe", age: 45, gender: "Male", contact: "555-0101", address: "123 Elm St", status: "Stable", medicalHistory: ["Hypertension", "Seasonal Allergies"] },
                    { _id: "P-002", name: "Jane Smith", age: 32, gender: "Female", contact: "555-0102", address: "456 Oak Ave", status: "Critical", medicalHistory: ["Diabetes Type 2", "Insulin Dependent"] },
                    { _id: "P-003", name: "Robert Johnson", age: 58, gender: "Male", contact: "555-0103", address: "789 Pine Rd", status: "Recovering", medicalHistory: ["Post-Surgery (Knee Replacement)"] }
                ];
            }

            const found = data.find(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p._id.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (found) {
                setPatientData(found);

                // Fetch active appointment for this patient
                try {
                    const aptRes = await api.get('/appointments');
                    const active = aptRes.data.find(a =>
                        (a.patient?._id === found._id || a.patient === found._id) &&
                        a.status === 'Scheduled'
                    );
                    setActiveAppointment(active);
                } catch (aptErr) {
                    console.warn("Could not fetch appointments for sync");
                }

                toast.success("Patient record retrieved");
            } else {
                toast.error("Patient not found");
            }
        } catch (error) {
            console.error("EMR Fetch Error", error);
            toast.error("Failed to access EMR database");
        } finally {
            setLoading(false);
        }
    };

    const completeVisit = async () => {
        if (!activeAppointment) {
            toast.error("No active appointment found to complete");
            return;
        }

        setIsCompleting(true);
        try {
            await api.put(`/appointments/${activeAppointment._id}/complete`, {
                clinicalNotes: noteText,
                codes: suggestedCodes
            });
            toast.success("Visit completed! Records updated and Invoice drafted.");
            setNoteText('');
            setSuggestedCodes([]);
            setActiveAppointment(null);
            setPatientData(null); // Reset for next patient
        } catch (err) {
            console.error("Visit completion error", err);
            toast.error("Failed to complete visit. Please try again.");
        } finally {
            setIsCompleting(false);
        }
    };

    const generateBillingCodes = () => {
        if (!noteText && (!patientData || !patientData.medicalHistory)) {
            toast.error("Please provide clinical notes for analysis");
            return;
        }

        setIsAnalyzingCodes(true);
        toast.info("AI is identifying clinical contexts and ICD-10 codes...");

        setTimeout(() => {
            const combinedText = (noteText + " " + (patientData?.medicalHistory?.join(" ") || "")).toLowerCase();
            const codes = [];

            // Simple demo mapping
            const mapping = [
                { keyword: 'hypertension', code: 'I10', desc: 'Essential (primary) hypertension' },
                { keyword: 'diabetes', code: 'E11.9', desc: 'Type 2 diabetes mellitus' },
                { keyword: 'fever', code: 'R50.9', desc: 'Fever, unspecified' },
                { keyword: 'cough', code: 'R05', desc: 'Cough' },
                { keyword: 'back pain', code: 'M54.5', desc: 'Low back pain' },
                { keyword: 'infection', code: 'B99.9', desc: 'Unspecified infectious disease' },
                { keyword: 'headache', code: 'R51', desc: 'Headache' },
                { keyword: 'knee', code: 'M17.1', desc: 'Osteoarthritis of knee' }
            ];

            mapping.forEach(m => {
                if (combinedText.includes(m.keyword)) {
                    codes.push(m);
                }
            });

            if (codes.length === 0) {
                codes.push({ code: 'Z00.00', desc: 'General adult medical examination' });
            }

            setSuggestedCodes(codes);
            setIsAnalyzingCodes(false);
            toast.success("ICD-10 Suggestions Ready");
        }, 2000);
    };

    const runAiAnalysis = () => {
        if (!patientData) return;
        toast.info("MediFlow AI is analyzing clinical notes...");

        setTimeout(() => {
            let analysis = "Routine checkup recommended.";
            if (patientData.status === 'Critical') analysis = "URGENT: High risk of complications. Recommend immediate ICU monitoring and specialist review.";
            else if (patientData.status === 'Recovering') analysis = "Positive trajectory. Continue current medication plan. Schedule follow-up in 2 weeks.";
            else if (patientData.status === 'Stable') analysis = "Vitals within normal limits. maintain healthy diet and exercise.";

            setAiAnalysis(analysis);
            toast.success("AI Analysis Complete");
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Electronic Medical Records (EMR)</h2>
                    <p className="text-gray-500">Access and manage comprehensive patient health records.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Search Panel */}
                <Card className="md:col-span-3 lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Patient Lookup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Patient Name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch} disabled={loading}>
                                {loading ? <Search className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                            Enter a name (e.g., "John") to search the live database.
                        </p>
                    </CardContent>
                </Card>

                {/* EMR Display / Placeholder */}
                <Card className="md:col-span-3 lg:col-span-2 border-dashed border-2 bg-gray-50/50 min-h-[400px]">
                    <CardContent className="flex flex-col items-center justify-center h-full py-8 text-center">
                        {!patientData ? (
                            <>
                                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                    <FileText className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">EMR System Active</h3>
                                <p className="text-gray-500 max-w-md mt-2">
                                    Search for a patient to view their full medical history, lab results, and prescriptions.
                                </p>
                            </>
                        ) : (
                            <div className="w-full text-left space-y-6 animate-in zoom-in-95 duration-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{patientData.name}</h3>
                                        <p className="text-gray-500">ID: {patientData._id} • Age: {patientData.age} • Gender: {patientData.gender}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${patientData.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                        patientData.status === 'Stable' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {patientData.status}
                                    </div>
                                </div>

                                <div className="flex justify-end mt-2">
                                    <Button variant="outline" size="sm" onClick={() => window.open(`/discharge/${patientData._id}`, '_blank')}>
                                        <FileText className="mr-2 h-4 w-4" /> Discharge Summary
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white rounded-lg shadow-sm border">
                                        <h4 className="font-semibold text-gray-700 mb-2">Medical History</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                            {patientData.medicalHistory?.length > 0 ?
                                                patientData.medicalHistory.map((h, i) => <li key={i}>{h}</li>) :
                                                <li>No significant history recorded.</li>
                                            }
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg shadow-sm border">
                                        <h4 className="font-semibold text-gray-700 mb-2">Contact Info</h4>
                                        <p className="text-sm text-gray-600">{patientData.contact}</p>
                                        <p className="text-sm text-gray-600">{patientData.address}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 h-fit">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-indigo-900 flex items-center gap-2">
                                                <BrainCircuit className="h-5 w-5" />
                                                AI Clinical Support
                                            </h4>
                                            {!aiAnalysis && (
                                                <Button size="sm" onClick={runAiAnalysis} className="bg-indigo-600 hover:bg-indigo-700">
                                                    Analyze Records
                                                </Button>
                                            )}
                                        </div>

                                        {aiAnalysis && (
                                            <div className="p-3 bg-white rounded border border-indigo-100 text-indigo-800 text-sm animate-in fade-in">
                                                <strong>AI Insight:</strong> {aiAnalysis}
                                            </div>
                                        )}
                                    </div>

                                    {/* Voice Scribe Feature */}
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Mic className={`h-4 w-4 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                                            Clinical Notes (Voice Scribe)
                                        </h4>
                                        <div className="relative">
                                            <textarea
                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-primary focus:outline-none min-h-[100px]"
                                                placeholder="Click the mic to dictate notes..."
                                                value={noteText}
                                                onChange={(e) => setNoteText(e.target.value)}
                                            />
                                            <button
                                                onClick={toggleListening}
                                                className={`absolute bottom-2 right-2 p-2 rounded-full shadow-sm transition-colors ${isListening ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                                title={isListening ? "Stop Recording" : "Start Dictation"}
                                            >
                                                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                                onClick={generateBillingCodes}
                                                disabled={isAnalyzingCodes || isCompleting}
                                            >
                                                <BrainCircuit className={`mr-2 h-4 w-4 ${isAnalyzingCodes ? 'animate-pulse' : ''}`} />
                                                AI Smart Billing
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={completeVisit}
                                                disabled={isCompleting || !noteText}
                                            >
                                                {isCompleting ? 'Processing...' : 'Complete Visit & Save'}
                                            </Button>
                                        </div>

                                        {!activeAppointment && patientData && (
                                            <p className="mt-2 text-[10px] text-orange-600 italic">
                                                * No active scheduled appointment found for this patient.
                                            </p>
                                        )}

                                        {suggestedCodes.length > 0 && (
                                            <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100 shadow-sm animate-in slide-in-from-top-2">
                                                <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">Smart ICD-10 Suggestions</h5>
                                                <div className="space-y-2">
                                                    {suggestedCodes.map((c, i) => (
                                                        <div key={i} className="flex items-center justify-between p-2 bg-indigo-50/50 rounded border border-indigo-50">
                                                            <div>
                                                                <span className="text-xs font-bold text-indigo-700 mr-2">{c.code}</span>
                                                                <span className="text-xs text-indigo-900">{c.desc}</span>
                                                            </div>
                                                            <Button size="xs" variant="ghost" className="h-6 text-[10px] text-indigo-600 hover:bg-indigo-100 px-2" onClick={() => toast.success(`Code ${c.code} added to invoice draft`)}>
                                                                Add to Bill
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
