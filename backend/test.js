import axios from 'axios';
import FormData from 'form-data';

async function test() {
    try {
        console.log("1. Signing up a test user...");
        const email = `test${Date.now()}@example.com`;
        const signupRes = await axios.post('http://localhost:8000/api/auth/signup', {
            name: "Test User",
            email: email,
            password: "password123"
        });
        
        const cookie = signupRes.headers['set-cookie'] ? signupRes.headers['set-cookie'][0] : null;

        console.log("2. Sending update request via PUT...");
        const form = new FormData();
        form.append('assistantName', 'Jarvis');
        form.append('assistantImage', '/src/assets/Image1.jpeg');

        const config = {
            headers: {
                ...form.getHeaders(),
                Cookie: cookie
            },
            withCredentials: true
        };

        const updateRes = await axios.put('http://localhost:8000/api/user/update', form, config);
        console.log("Update success! User returned:", updateRes.data);

    } catch (err) {
        console.error("Test failed with STATUS:", err.response ? err.response.status : "Unknown");
        console.error("Test failed with MESSAGE:", err.response ? err.response.data : err.message);
    }
}

test();
