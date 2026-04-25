async function test() {
    try {
        console.log("1. Signing up a test user...");
        const email = `test${Date.now()}@example.com`;
        
        const signupRes = await fetch('http://localhost:8000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test User",
                email: email,
                password: "password123"
            })
        });
        
        if (!signupRes.ok) {
            const err = await signupRes.text();
            throw new Error("Signup failed: " + err);
        }
        
        const cookie = signupRes.headers.get('set-cookie');
        console.log("Signup success. Cookie:", cookie);

        console.log("2. Sending update request with predefined image...");
        
        const formBody = new FormData();
        formBody.append('assistantName', 'Jarvis');
        formBody.append('assistantImage', '/src/assets/Image1.jpeg');

        const updateRes = await fetch('http://localhost:8000/api/user/update', {
            method: 'PUT',
            headers: {
                'Cookie': cookie
            },
            body: formBody
        });
        
        if (!updateRes.ok) {
            const err = await updateRes.text();
            throw new Error(`Update failed (${updateRes.status}): ` + err);
        }
        
        const data = await updateRes.json();
        console.log("Update success:", data);

    } catch (err) {
        console.error(err);
    }
}
test();
