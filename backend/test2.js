async function test() {
    try {
        console.log("1. Sending update request to see what HTTP status we get...");
        
        // Try a raw PUT to /api/user/update to see if it even exists (expect 401 if it exists, 404 if it is missing)
        const response = await fetch('http://localhost:8000/api/user/update', {
            method: 'PUT'
        });
        
        const status = response.status;
        console.log("HTTP Status for PUT /api/user/update is:", status);
        
    } catch (err) {
        console.error("Test failed:", err);
    }
}
test();
