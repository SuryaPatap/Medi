const API_URL = 'http://localhost:5001/api';

const seed = async () => {
    console.log('--- Seeding via API (Debug Mode) ---');
    try {
        // 1. Login
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@mediflow.com', password: 'admin' })
        });

        if (!loginRes.ok) {
            const txt = await loginRes.text();
            throw new Error(`Login failed: ${loginRes.status} ${txt}`);
        }
        const { token } = await loginRes.json();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': token };
        console.log('[+] Logged in as Admin');

        // 2. Add Patients
        const patients = [
            { name: "John Doe", age: 45, gender: "Male", phone: "555-0101", address: "123 Elm St", status: "Stable", medicalHistory: ["Hypertension"], lastVisit: new Date() },
            { name: "Jane Smith", age: 32, gender: "Female", phone: "555-0102", address: "456 Oak Ave", status: "Critical", medicalHistory: ["Diabetes Type 2"], lastVisit: new Date(Date.now() - 86400000) }
        ];

        let patientIds = [];
        for (const p of patients) {
            const res = await fetch(`${API_URL}/patients`, { method: 'POST', headers, body: JSON.stringify(p) });
            const txt = await res.text();
            if (res.ok) {
                const data = JSON.parse(txt);
                patientIds.push(data._id);
                console.log(`   [OK] Added patient ${p.name}`);
            } else {
                console.error(`   [FAIL] Add patient ${p.name}: ${res.status} ${txt}`);
            }
        }

        // 3. Add Inventory
        const inventory = [
            { name: 'Paracetamol 500mg', category: 'Medicine', quantity: 500, unit: 'Tablets', status: 'In Stock', minLevel: 100 }
        ];
        for (const item of inventory) {
            const res = await fetch(`${API_URL}/inventory`, { method: 'POST', headers, body: JSON.stringify(item) });
            if (res.ok) console.log(`   [OK] Added inventory ${item.name}`);
            else console.error(`   [FAIL] Add inventory ${item.name}: ${res.status} ${await res.text()}`);
        }

        console.log('--- Seeding Complete ---');

    } catch (err) {
        console.error("Seeding Failed:", err.message);
    }
};

seed();
