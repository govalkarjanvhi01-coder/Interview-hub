const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://janhvigovalkar:Janhvig123@cluster0.fp3kdue.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    family: 4,
    tls: true,
        autoSelectFamily: false
});

async function connectDB() {
    try {
        await client.connect();

        console.log("MongoDB Connected Successfully! ✅");

        await client.db("admin").command({ ping: 1 });

        console.log("MongoDB Ping Successful! ✅");

    } catch (error) {
        console.error("MongoDB Connection Failed ❌");
        console.error(error);
    }
}

connectDB();

module.exports = { client, connectDB };