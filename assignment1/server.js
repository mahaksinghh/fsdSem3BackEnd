const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

const PORT = 3000;

const server = http.createServer((req, res) => {

    // Home page
    if (req.url === "/" && req.method === "GET") {

        res.writeHead(200, { "Content-Type": "text/html" });

        res.end(`
            <html>
            <head>
                <title>Student Records</title>
            </head>
            <body>
                <h1>Welcome to Student Record Management</h1>

                <form action="/add" method="POST">

                    <label>Student Name:</label>
                    <input type="text" name="name" required>
                    <br><br>

                    <label>Roll Number:</label>
                    <input type="text" name="roll" required>
                    <br><br>

                    <label>Course:</label>
                    <input type="text" name="course" required>
                    <br><br>

                    <label>Email:</label>
                    <input type="email" name="email" required>
                    <br><br>

                    <button type="submit">Add Student</button>

                </form>

                <br>
                <a href="/students">View Student Records</a>
            </body>
            </html>
        `);
    }

    // Add student
    else if (req.url === "/add" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const data = querystring.parse(body);

            const student = {
                name: data.name,
                roll: data.roll,
                course: data.course,
                email: data.email
            };

            fs.readFile("students.json", "utf8", (err, fileData) => {

                let students = [];

                if (!err && fileData) {
                    students = JSON.parse(fileData);
                }

                students.push(student);

                fs.writeFile(
                    "students.json",
                    JSON.stringify(students, null, 2),
                    (err) => {

                        if (err) {
                            res.writeHead(500);
                            res.end("Error saving student record");
                            return;
                        }

                        res.writeHead(200, { "Content-Type": "text/html" });

                        res.end(`
                            <h2>Student added successfully!</h2>
                            <a href="/">Add Another Student</a>
                            <br><br>
                            <a href="/students">View Student Records</a>
                        `);
                    }
                );
            });
        });
    }

    // Display students
    else if (req.url === "/students" && req.method === "GET") {

        fs.readFile("students.json", "utf8", (err, data) => {

            let students = [];

            if (!err && data) {
                students = JSON.parse(data);
            }

            res.writeHead(200, { "Content-Type": "text/html" });

            let html = `
                <html>
                <head>
                    <title>Student Records</title>
                </head>
                <body>

                <h1>Student Records</h1>

                <table border="1" cellpadding="10">
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Course</th>
                        <th>Email</th>
                    </tr>
            `;

            students.forEach((student) => {
                html += `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.roll}</td>
                        <td>${student.course}</td>
                        <td>${student.email}</td>
                    </tr>
                `;
            });

            html += `
                </table>

                <br>
                <a href="/">Back to Form</a>

                </body>
                </html>
            `;

            res.end(html);
        });
    }

    // Invalid route
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - Page Not Found</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});