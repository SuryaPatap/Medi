const API_URL = 'http://localhost:5001/api';

const seed = async () => {
    console.log('--- Seeding via API ---');
    try {
        // 1. Login
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@mediflow.com', password: 'admin' })
        });

        if (!loginRes.ok) throw new Error("Login failed. Ensure server is running on 5001.");
        const { token } = await loginRes.json();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': token };
        console.log('[+] Logged in as Admin');

        // 2. Add Patients
        const patients = [
            { name: "John Doe", age: 45, gender: "Male", contact: "555-0101", address: "123 Elm St", status: "Stable", medicalHistory: ["Hypertension"], lastVisit: new Date() },
            { name: "Jane Smith", age: 32, gender: "Female", contact: "555-0102", address: "456 Oak Ave", status: "Critical", medicalHistory: ["Diabetes Type 2"], lastVisit: new Date(Date.now() - 86400000) },
            { name: "Robert Johnson", age: 58, gender: "Male", contact: "555-0103", address: "789 Pine Rd", status: "Recovering", medicalHistory: ["Post-Surgery"], lastVisit: new Date() }
        ];

        let patientIds = [];
        for (const p of patients) {
            const res = await fetch(`${API_URL}/patients`, { method: 'POST', headers, body: JSON.stringify(p) });
            const data = await res.json();
            if (res.ok) patientIds.push(data._id);
            else console.log(`Failed to add patient ${p.name}:`, data);
        }
        console.log(`[+] Added ${patientIds.length} Patients`);

        // 3. Add Inventory
        const inventory = [
            { name: 'Paracetamol 500mg', category: 'Medicine', quantity: 500, unit: 'Tablets', status: 'In Stock', minLevel: 100 },
            { name: 'Surgical Masks', category: 'Consumables', quantity: 45, unit: 'Boxes', status: 'In Stock', minLevel: 10 },
            { name: 'Syringes 5ml', category: 'Consumables', quantity: 0, unit: 'Pieces', status: 'Out of Stock', minLevel: 50 }
        ];
        for (const item of inventory) {
            await fetch(`${API_URL}/inventory`, { method: 'POST', headers, body: JSON.stringify(item) });
        }
        console.log(`[+] Added Inventory`);

        // 4. Add Appointments (if patients exist)
        if (patientIds.length >= 3) {
            const appointments = [
                { patient: patientIds[0], doctor: "Dr. Sarah Smith", date: new Date(), time: "09:00 AM", type: "Checkup", status: "Scheduled" },
                { patient: patientIds[1], doctor: "Dr. Mike Jones", date: new Date(), time: "11:30 AM", type: "Consultation", status: "Completed" },
                { patient: patientIds[2], doctor: "Dr. Emily White", date: new Date(Date.now() + 86400000), time: "02:00 PM", type: "Follow-up", status: "Scheduled" }
            ];
            for (const apt of appointments) {
                await fetch(`${API_URL}/appointments`, { method: 'POST', headers, body: JSON.stringify(apt) });
            }
            console.log(`[+] Added Appointments`);
        }

        console.log('--- Seeding Complete ---');

    } catch (err) {
        console.error("Seeding Failed:", err.message);
    }
};

seed();
