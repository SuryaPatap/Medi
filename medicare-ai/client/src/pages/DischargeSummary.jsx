import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../api/axios';

export default function DischargeSummary() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        // Fetch patient data (Mock fallback if API fails)
        const fetchData = async () => {
            try {
                // Try real API first
                const res = await api.get('/patients');
                const found = res.data.find(p => p._id === id);
                if (found) {
                    setPatient(found);
                    return;
                }
            } catch (e) {
                console.warn("API Error, falling back");
            }

            // Fallback Mock Data
            const mocks = [
                { _id: "P-001", name: "John Doe", age: 45, gender: "Male", contact: "555-0101", address: "123 Elm St", status: "Stable", medicalHistory: ["Hypertension"], admissionDate: "2023-11-15", dischargeDate: new Date().toISOString().split('T')[0] },
                { _id: "P-002", name: "Jane Smith", age: 32, gender: "Female", contact: "555-0102", address: "456 Oak Ave", status: "Critical", diagnosis: "Diabetic Ketoacidosis", treatment: "Insulin Therapy, IV Fluids", admissionDate: "2023-11-10", dischargeDate: new Date().toISOString().split('T')[0] }
            ];

            // If ID matches mock, use it, otherwise default to first mock for demo
            const mockFound = mocks.find(m => m._id === id) || mocks[0];
            setPatient({
                ...mockFound,
                // Ensure defaults for fields that might be missing
                diagnosis: mockFound.diagnosis || "Viral Fever & Dehydration",
                treatment: mockFound.treatment || "IV Fluids, Paracetamol 500mg BD, Rest",
                medications: [
                    { name: "Augmentin 625mg", dosage: "1-0-1", days: "5 Days" },
                    { name: "Pan 40mg", dosage: "1-0-0", days: "5 Days" },
                    { name: "B-Complex", dosage: "0-1-0", days: "10 Days" }
                ]
            });
        };
        fetchData();
    }, [id]);

    if (!patient) return <div className="p-8">Loading Summary...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
            {/* Action Bar - Hidden in Print */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" /> Print Summary
                </Button>
            </div>

            {/* A4 Paper Effect */}
            <div className="max-w-4xl mx-auto bg-white shadow-xl p-12 min-h-[297mm] print:shadow-none print:w-full print:max-w-none">

                {/* Hospital Header */}
                <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-blue-600 rounded flex items-center justify-center print:border print:border-gray-300">
                            <Building2 className="h-10 w-10 text-white print:text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">MediFlow General Hospital</h1>
                            <p className="text-slate-500 text-sm">123 Healthcare Ave, Springfield, IL 62704</p>
                            <p className="text-slate-500 text-sm">Ph: (555) 123-4567 | Email: records@mediflow.com</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">Discharge Summary</h2>
                        <p className="text-slate-500 font-mono mt-1">REF: {patient._id}-{Math.floor(Math.random() * 1000)}</p>
                        <p className="text-slate-500 font-mono">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Patient Details Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-sm">
                    <div>
                        <p className="text-slate-500 uppercase text-xs font-semibold">Patient Name</p>
                        <p className="font-bold text-lg">{patient.name}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 uppercase text-xs font-semibold">PID / Age / Gender</p>
                        <p className="font-bold text-lg">{patient._id} / {patient.age}Y / {patient.gender}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 uppercase text-xs font-semibold">Admission Date</p>
                        <p>{patient.admissionDate || "2023-10-20"}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 uppercase text-xs font-semibold">Discharge Date</p>
                        <p>{patient.dischargeDate || new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-slate-500 uppercase text-xs font-semibold">Address</p>
                        <p>{patient.address}</p>
                    </div>
                </div>

                {/* Clinical Sections */}
                <div className="space-y-6">
                    <section>
                        <h3 className="bg-slate-100 px-3 py-1 font-bold text-slate-800 border-l-4 border-slate-800 uppercase text-sm mb-2 print:bg-gray-100">Diagnosis</h3>
                        <p className="text-gray-800 leading-relaxed px-3">{patient.diagnosis}</p>
                    </section>

                    <section>
                        <h3 className="bg-slate-100 px-3 py-1 font-bold text-slate-800 border-l-4 border-slate-800 uppercase text-sm mb-2 print:bg-gray-100">Treatment Summary</h3>
                        <p className="text-gray-800 leading-relaxed px-3">{patient.treatment}</p>
                    </section>

                    <section>
                        <h3 className="bg-slate-100 px-3 py-1 font-bold text-slate-800 border-l-4 border-slate-800 uppercase text-sm mb-2 print:bg-gray-100">Discharge Medications</h3>
                        <div className="px-3">
                            <table className="w-full text-left text-sm mt-2 border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-300">
                                        <th className="py-2 font-semibold text-gray-700">Medicine Name</th>
                                        <th className="py-2 font-semibold text-gray-700">Dosage</th>
                                        <th className="py-2 font-semibold text-gray-700">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patient.medications && patient.medications.map((med, i) => (
                                        <tr key={i} className="border-b border-gray-100">
                                            <td className="py-2">{med.name}</td>
                                            <td className="py-2 font-mono">{med.dosage}</td>
                                            <td className="py-2">{med.days}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h3 className="bg-slate-100 px-3 py-1 font-bold text-slate-800 border-l-4 border-slate-800 uppercase text-sm mb-2 print:bg-gray-100">Advice on Discharge</h3>
                        <ul className="list-disc list-inside px-3 text-gray-800 text-sm space-y-1">
                            <li>Review in opd after 5 days.</li>
                            <li>Take medications as prescribed.</li>
                            <li>Avoid spicy and oily food.</li>
                            <li>In case of emergency, contact casualty: (555) 999-0000.</li>
                        </ul>
                    </section>
                </div>

                {/* Footer / Signatures */}
                <div className="mt-20 grid grid-cols-2 gap-12 pt-8 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-12">Authorized Signatory</p>
                        <hr className="w-1/2 mx-auto border-gray-400" />
                        <p className="font-bold mt-2">Dr. Sarah Smith, MD</p>
                        <p className="text-xs text-gray-500">Chief Medical Officer</p>
                    </div>
                </div>

                <div className="mt-12 text-center text-xs text-slate-400 print:fixed print:bottom-8 print:w-full print:left-0">
                    Generated by MediFlow AI Hospital System • {new Date().toLocaleString()}
                </div>
            </div>
        </div>
    );
}
