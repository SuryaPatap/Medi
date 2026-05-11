const axios = require('axios');

const testLogin = async () => {
    try {
        const payload = {
            email: 'executive@mediflow.com',
            password: 'admin123',
            role: 'executive'
        };
        console.log('Sending Payload:', payload);

        const response = await axios.post('http://127.0.0.1:5003/api/auth/login', payload);
        console.log('Login Success!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Login Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testLogin();
