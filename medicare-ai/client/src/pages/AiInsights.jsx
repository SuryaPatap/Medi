import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';

export default function AiInsights() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-purple-600" />
                        AI Insights
                    </h2>
                    <p className="text-gray-500">Predictive analytics and intelligent recommendations powered by MediFlow AI.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Prediction 1 */}
                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm border">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <CardTitle className="text-base font-semibold text-purple-900">Patient Influx Prediction</CardTitle>
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 mb-2">+15%</div>
                        <p className="text-sm text-gray-600">
                            Expected increase in patient visits next week due to seasonal flu trends.
                        </p>
                        <div className="mt-4">
                            <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={() => toast.info("Staffing plan generated.")}>View Staffing Plan</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Prediction 2 */}
                <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-sm border">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <CardTitle className="text-base font-semibold text-amber-900">Inventory Alert</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 mb-2">Low Stock</div>
                        <p className="text-sm text-gray-600">
                            "Amoxicillin 500mg" is predicted to run out in 3 days based on current usage rate.
                        </p>
                        <div className="mt-4">
                            <Button size="sm" variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => toast.success("Order #9822 created.")}>Order Restock</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Prediction 3 */}
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm border">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <CardTitle className="text-base font-semibold text-blue-900">Appointment Optimization</CardTitle>
                        <Users className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 mb-2">2.5 hrs</div>
                        <p className="text-sm text-gray-600">
                            Potential saved time/week by optimizing Dr. Smith's schedule gaps.
                        </p>
                        <div className="mt-4">
                            <Button size="sm" variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => toast.success("Schedule optimization applied.")}>Apply Schedule Fix</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-gray-500" />
                        Clinical Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                            <h4 className="font-semibold text-gray-900">Diabetic Patient Protocol</h4>
                            <p className="text-sm text-gray-600 mt-1">Based on recent lab results, 5 patients may qualify for the new Type 2 management protocol. Review list?</p>
                            <Button variant="link" className="px-0 text-primary mt-2 h-auto" onClick={() => toast.info("Function coming soon in v1.1.0")}>Review Patients &rarr;</Button>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                            <h4 className="font-semibold text-gray-900">Readmission Risk</h4>
                            <p className="text-sm text-gray-600 mt-1">Patient #PT-1092 shows high probability of readmission within 30 days. Recommended action: Follow-up call.</p>
                            <Button variant="link" className="px-0 text-primary mt-2 h-auto" onClick={() => toast.info("Call scheduled.")}>Schedule Call &rarr;</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
