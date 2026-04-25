async function test() {
    try {
        console.log("1. Sending POST request to see if it responds instead of PUT...");
        
        const response = await fetch('http://localhost:8000/api/user/update', {
            method: 'POST'
        });
        
        console.log("HTTP Status for POST /api/user/update is:", response.status);
    } catch (err) {
        console.error(err);
    }
}
test();
