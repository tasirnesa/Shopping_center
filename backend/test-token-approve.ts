import * as jwt from 'jsonwebtoken';
import * as http from 'http';

const token = jwt.sign({ sub: 'ff2fa1f9-a5b8-4735-a87c-ba7a79ed7227', role: 'INVOICE_MAKER', organizationId: null }, process.env.JWT_SECRET || 'secretKey');

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/orders/575498f9-07fc-47e6-ae58-d8c5b53d8ffb/approve', // we submitted it, status is SUBMITTED, approve should work
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    }
}, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        console.log('Approve Status:', res.statusCode);
        console.log('Approve Body:', data);
    });
});
req.end();
