// เปลี่ยน localhost -> Public IPv4 address
// const backend_uri = "http://localhost:3222"
const backend_uri = "https://backend-service-kdww.onrender.com"

// get all apts data
async function getApts() {
    const response = await fetch(`${backend_uri}/items/`);
    if(!response.ok){
        throw new Error('BOOM');
    }
    const data = await response.json();
    return data;
}

// post new apts data
async function postApts(apts) {
    const response = await fetch(`${backend_uri}/items/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(apts), // Convert the object to JSON string
    });

    if (!response.ok) {
        throw new Error('BOOM');
    }
}

// delete apts data by ID
async function deleteApts(apartmentId) {
    try {
        const response = await fetch(`${backend_uri}/items/${apartmentId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Failed to delete apartment with ID ${apartmentId}`);
        }
    } catch (error) {
        throw new Error(`Delete request failed: ${error.message}`);
    }
}

export {getApts, postApts, deleteApts};