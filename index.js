const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// midddleware
app.use(cors());
app.use(express.json())


// mongodb Uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bsoks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// to check the uri 
console.log(uri);

// database function 
async function run (){
    try{
        await client.connect();
        const database = client.db('travio_db');
        const serviceCollection = database.collection('services');

        // GET services API
        app.get('/services', async(req, res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })




        console.log("database connected successfully");

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('travio-Mongo-server is RUNNING.');
})


app.listen(port, () => {
    console.log("server running at port:", port);
})