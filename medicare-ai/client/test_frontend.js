const axios = require('axios');

async function checkFrontend() {
    const ports = [5173, 5174, 3000, 3001, 3002];
    for (const port of ports) {
        try {
            console.log(`Checking http://localhost:${port}...`);
            const res = await axios.get(`http://localhost:${port}`);
            if (res.data.includes('<div id="root">')) {
                console.log(`SUCCESS: React App found on port ${port}!`);
                return;
            }
        } catch (err) {
            // Ignore connection errors and try next port
        }
    }
    console.log("FAILURE: Could not find running React app on any common port.");
}

checkFrontend();
