const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const specialCollection = database.collection('specials');
        const orderCollection = database.collection('orders');

        // GET services API
        app.get('/services', async(req, res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // GET services API
        app.get('/manageOrders', async(req, res) =>{
            const cursor = orderCollection.find({});
            const allorders = await cursor.toArray();
            res.send(allorders);
        })

        // GET special API
        app.get('/specials', async(req, res) =>{
            const cursor = specialCollection.find({});
            const specials = await cursor.toArray();
            res.send(specials);
        })
        // GET order API
        app.get('/orders', async(req, res) =>{
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })
        // GET SingleProduct API
        app.get('/singleProduct/:id', async(req, res) =>{
            const result = await serviceCollection.find({_id: ObjectId(req.params.id)}).toArray();
            res.send(result[0]);
        })

        // add Services POST API
        app.post('/addServices', async (req, res) => {
            const result = await serviceCollection.insertOne(req.body);
            res.send(result);
            // console.log(req.body);
        })

        // add ConfirmOrder POST API
        app.post('/confirmOrder', async (req, res) => {
            const result = await orderCollection.insertOne(req.body);
            // console.log(result);
            res.send(result);
            // console.log(req.body);
            // http://localhost:5000/confirmOrder 
        })

        // my confirm orderss
        app.get('/myOrderss/:username', async(req, res) =>{
            const result = await orderCollection.find({username: req.params.username}).toArray();
            // res.send(result[0]);
            res.send(result);
        })

        // delete Order
        app.delete('/deleteOrder/:id', async (req, res) => {
            const result = await orderCollection.deleteOne({_id: ObjectId(req.params.id)});
            res.send(result);
        })

        // update statuss
        app.put('/updateStatus/:id', async (req, res) =>{
            const id = req.params.id;
            const updatedStatus = req.body.status;
            console.log(updatedStatus);
            
        })
        // delete Order
        app.delete('/deleteService/:id', async (req, res) => {
            const result = await serviceCollection.deleteOne({_id: ObjectId(req.params.id)});
            res.send(result);
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