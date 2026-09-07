import fetch from 'node-fetch'; // Wait, let's use standard node http or axios if we can! Better write a quick nested script.
import * as http from 'http';

const loginBody = JSON.stringify({
  email: 'sales@gmail.com',
  password: 'password123'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginBody)
  }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const json = JSON.parse(data);
    const token = json.accessToken;
    
    if (token) {
        // Now submit order
        const orderReq = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/orders/575498f9-07fc-47e6-ae58-d8c5b53d8ffb/submit',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }, (res2) => {
            let data2 = '';
            res2.on('data', d => data2 += d);
            res2.on('end', () => {
                console.log('Submit Response Status:', res2.statusCode);
                console.log('Submit Response Body:', data2);
            });
        });
        orderReq.end();
    } else {
        console.log('Login failed:', data);
    }
  });
});
req.write(loginBody);
req.end();
