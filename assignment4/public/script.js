const form = document.getElementById("requestForm");
const requestsList = document.getElementById("requestsList");

// Get all requests
async function getRequests() {
    const response = await fetch("/api/requests");
    const requests = await response.json();

    displayRequests(requests);
}

// Display requests
function displayRequests(requests) {

    requestsList.innerHTML = "";

    requests.forEach(request => {

        const div = document.createElement("div");

        div.className = "request";

        div.innerHTML = `
            <h3>${request.studentName}</h3>

            <p><strong>Email:</strong> ${request.email}</p>

            <p><strong>Category:</strong> ${request.category}</p>

            <p><strong>Problem:</strong> ${request.description}</p>

            <p><strong>Priority:</strong> ${request.priority}</p>

            <button onclick="editRequest(${request.id})">
                Edit
            </button>

            <button onclick="deleteRequest(${request.id})">
                Delete
            </button>
        `;

        requestsList.appendChild(div);
    });
}

// Submit new request
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const requestData = {
        studentName: document.getElementById("studentName").value,
        email: document.getElementById("email").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        priority: document.getElementById("priority").value
    };

    await fetch("/api/requests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    });

    form.reset();

    getRequests();
});

// Delete request
async function deleteRequest(id) {

    await fetch(`/api/requests/${id}`, {
        method: "DELETE"
    });

    getRequests();
}

// Update request
async function editRequest(id) {

    const studentName = prompt("Enter Student Name:");
    const email = prompt("Enter Email:");
    const category = prompt("Enter Category:");
    const description = prompt("Enter Problem Description:");
    const priority = prompt("Enter Priority:");

    const updatedRequest = {
        studentName,
        email,
        category,
        description,
        priority
    };

    await fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedRequest)
    });

    getRequests();
}

// Load requests when page opens
getRequests();