
const express = require("express");
const path = require("path");
const { connectDB, client } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// Frontend static files
app.use(express.static(path.join(__dirname, "..")));

// Database collections
let messages;
let users;

// Home page
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "homeInterview hub.html")
    );
});

// Login page
app.get("/loA.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "loA.html"));
});

// Signup page
app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "signup.html"));
});

// Server test
app.get("/test", (req, res) => {
    res.json({
        message: "Server is working correctly"
    });
});

// Login route test
app.get("/login-test", (req, res) => {
    res.json({
        message: "Login route is working"
    });
});

// Save profile API
app.post("/api/message", async (req, res) => {
    try {
        const { name, email, contact, state, city } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and Email are required"
            });
        }

        await messages.insertOne({
            name,
            email,
            contact: contact || "",
            state: state || "",
            city: city || "",
            createdAt: new Date()
        });

        res.status(201).json({
            message: "Profile saved successfully",
            name,
            email
        });
    } catch (error) {
        console.error("Profile save error:", error);
        res.status(500).json({
            message: "Failed to save profile"
        });
    }
});

// Signup API
app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        // NOTE: Password hashing must be added before
        // using this application with real users.
        await users.insertOne({
            name,
            email,
            password,
            createdAt: new Date()
        });

        res.status(201).json({
            message: "Account created successfully",
            name,
            email
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Failed to create account"
        });
    }
});

// Login API
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const user = await users.findOne({ email });

        if (!user || password !== user.password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Login failed"
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Connect to MongoDB before starting the server
async function startServer() {
    try {
        await connectDB();

        const db = client.db("interviewHub");
        messages = db.collection("messages");
        users = db.collection("users");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

startServer();
