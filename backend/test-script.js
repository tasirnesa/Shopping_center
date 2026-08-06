const axios = require('axios');
async function run() {
    try {
        const login = await axios.post('http://localhost:3000/auth/login', { email: 'owner@abc.com', password: 'owner123' });
        const token = login.data.access_token;
        console.log("Logged in successfully. Token:", token.substring(0, 15) + "...");

        console.log("Fetching products...");
        await axios.get('http://localhost:3000/products', { headers: { Authorization: 'Bearer ' + token } });
        console.log("Products OK");

        console.log("Fetching sales...");
        await axios.get('http://localhost:3000/sales', { headers: { Authorization: 'Bearer ' + token } });
        console.log("Sales OK");

        console.log("Fetching stock balance...");
        await axios.get('http://localhost:3000/inventory/stock-balance', { headers: { Authorization: 'Bearer ' + token } });
        console.log("Stock balance OK");

        console.log("Fetching branches...");
        await axios.get('http://localhost:3000/foundation/branches', { headers: { Authorization: 'Bearer ' + token } });
        console.log("Branches OK");

    } catch (e) {
        if (e.response) {
            console.log('Error hitting route:', e.config.url, 'status:', e.response.status, e.response.data);
        } else {
            console.log('Other error:', e.message);
        }
    }
}
run();
