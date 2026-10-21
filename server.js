const express = require("express");
const path = require("path");

const { connectDB, client } = require("./db");

const app = express();
const PORT = 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());


// ==========================================
// CORS
// ==========================================

app.use((req, res, next) => {

    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

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


// ==========================================
// FRONTEND FILES
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);


// ==========================================
// MONGODB CONNECTION
// ==========================================

connectDB();

const db = client.db("interviewHub");

const messages = db.collection("messages");
const users = db.collection("users");


// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    const homePath = path.join(
        __dirname,
        "..",
        "homeInterview hub.html"
    );

    res.sendFile(homePath);

});


// ==========================================
// LOGIN PAGE
// ==========================================

app.get("/loA.html", (req, res) => {

    const loginPath = path.join(
        __dirname,
        "..",
        "loA.html"
    );

    res.sendFile(loginPath);

});


// ==========================================
// SIGNUP PAGE
// ==========================================

app.get("/signup.html", (req, res) => {

    const signupPath = path.join(
        __dirname,
        "..",
        "signup.html"
    );

    res.sendFile(signupPath);

});


// ==========================================
// SERVER TEST
// ==========================================

app.get("/test", (req, res) => {

    res.json({
        message:
            "Server is working correctly ✅"
    });

});


// ==========================================
// LOGIN TEST
// ==========================================

app.get("/login-test", (req, res) => {

    res.json({
        message:
            "Login route area is working ✅"
    });

});


// ==========================================
// PROFILE SAVE API
// ==========================================

app.post("/api/message", async (req, res) => {

    try {

        const {
            name,
            email,
            contact,
            state,
            city
        } = req.body;


        if (!name || !email) {

            return res.status(400).json({

                message:
                    "Name and Email are required ❌"

            });

        }


        await messages.insertOne({

            name: name,
            email: email,
            contact: contact || "",
            state: state || "",
            city: city || "",
            createdAt: new Date()

        });


        res.status(200).json({

            message:
                "Profile saved successfully in MongoDB ✅",

            name: name,
            email: email

        });

    }

    catch (error) {

        console.error(
            "Profile MongoDB Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to save profile ❌"

        });

    }

});


// ==========================================
// SIGNUP API
// ==========================================

app.post("/api/signup", async (req, res) => {

    try {

        console.log(
            "Signup request received:",
            req.body
        );


        const {
            name,
            email,
            password
        } = req.body;


        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Please fill all fields ❌"

            });

        }


        if (password.length < 8) {

            return res.status(400).json({

                message:
                    "Password must be at least 8 characters ❌"

            });

        }


        const existingUser =
            await users.findOne({

                email: email

            });


        if (existingUser) {

            return res.status(409).json({

                message:
                    "Email is already registered ❌"

            });

        }


        const newUser = {

            name: name,
            email: email,
            password: password,
            createdAt: new Date()

        };


        await users.insertOne(newUser);


        console.log(
            "New user saved:",
            email
        );


        res.status(201).json({

            message:
                "Account created successfully ✅",

            name: name,
            email: email

        });

    }

    catch (error) {

        console.error(
            "Signup Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to create account ❌"

        });

    }

});


// ==========================================
// LOGIN API
// ==========================================

app.post("/api/login", async (req, res) => {

    try {

        console.log(
            "Login request received:",
            req.body
        );


        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Please fill all fields ❌"

            });

        }


        const user =
            await users.findOne({

                email: email

            });


        if (!user) {

            return res.status(401).json({

                message:
                    "Gmail is not registered ❌"

            });

        }


        if (password !== user.password) {

            return res.status(401).json({

                message:
                    "Incorrect password ❌"

            });

        }


        console.log(
            "Login successful:",
            email
        );


        res.status(200).json({

            message:
                "Login Successful! ✅",

            name: user.name,
            email: user.email

        });

    }

    catch (error) {

        console.error(
            "Login Error:",
            error
        );

        res.status(500).json({

            message:
                "Login failed ❌"

        });

    }

});


// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {

    res.status(404).json({

        message:
            "Route not found ❌"

    });

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Server is running on http://localhost:${PORT}`
    );

});