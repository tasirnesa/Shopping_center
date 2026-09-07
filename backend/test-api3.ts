import * as jwt from 'jsonwebtoken';
import * as http from 'http';

const token = jwt.sign({ sub: '9c1def29-5674-49d0-8d3c-f8a5e80918ee', role: 'SALES_REP', organizationId: '4d8bcf2e-0039-4ce9-9773-89c063139f6d' }, process.env.JWT_SECRET || 'secretKey');

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/orders/8492074a-e38c-4ee4-a540-a6866375a29c/submit',
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
