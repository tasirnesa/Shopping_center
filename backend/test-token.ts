import * as jwt from 'jsonwebtoken';
import * as http from 'http';

const token = jwt.sign({ sub: '9c1def29-5674-49d0-8d3c-f8a5e80918ee' }, process.env.JWT_SECRET || 'secretKey');

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/orders/575498f9-07fc-47e6-ae58-d8c5b53d8ffb/submit',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    }
}, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Body:', data);
    });
});
req.end();
