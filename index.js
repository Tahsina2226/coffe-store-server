const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = "mongodb+srv://coffeHouse:7QLO9N7wtADqGHO6@cluster0.1jen4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient instance
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Async function to connect to MongoDB
async function run() {
    try {
        // Connect the client to MongoDB
        await client.connect();
        console.log("Successfully connected to MongoDB!");


        const database = client.db("coffeHouse");
        const coffeeCollection = database.collection("coffee");

        // POST route to add coffee
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log('Adding new coffee:', newCoffee);

            try {

                const result = await coffeeCollection.insertOne(newCoffee);
                res.status(201).send({ message: 'Coffee added successfully!', coffee: result });
            } catch (error) {
                console.error('Error adding coffee:', error);
                res.status(500).send({ message: 'Failed to add coffee.' });
            }
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
run().catch(console.dir);

// Root route for testing
app.get('/', (req, res) => {
    res.send('Coffee-making server is running!');
});


app.listen(port, () => {
    console.log(`Coffee server is running on port: ${port}`);
});