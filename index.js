const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// ready made middleware
app.use(cors());
app.use(express.json()) 



// database


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4gj9vp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const taskCollection = client.db("toDoestDB").collection("tasks");

    app.post('/tasks', async(req, res)=>{
        const taskInfo = req.body
        const result = await taskCollection.insertOne(taskInfo)
        res.send(result)
    })


    app.get('/tasks', async(req,res)=>{
        const email = req.query.email
        const status = req.query.status
        console.log(email)
        let query = {email}
        if (status){
            query.status={status}
        }
        const result = await taskCollection.find(query).toArray()
        res.send(result)
    })
app.put('/tasktodo/:id', async(req, res)=> {
    const id = req.params.id
    const info = req.body
    const filter = {_id: new ObjectId(id)}
    const updatedoc = {
        $set: {
            status: info.status
        }
    }
    const result = await taskCollection.updateOne(filter, updatedoc)
    res.send(result)
})

app.get('/tasks/:id', async(req, res)=> {
    const id = req.params.id
    const filter = {_id: new ObjectId(id)}
    const result = await taskCollection.findOne(filter)
    res.send(result)
})

app.put('/tasks/:id', async(req, res)=>{
    const id = req.params.id
    const task = req.body
    const filter = {_id: new ObjectId(id)}
    const updateDoc = {
        $set: {
            title: task.title,
            deadline: task.deadline,
            priority: task.priority,
            description: task.description
        }
    }
    const result = await taskCollection.updateOne(filter, updateDoc)
 res.send(result)
})

    app.delete('/tasks/:id', async(req, res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await taskCollection.deleteOne(query)
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// root api
app.get('/', (req, res)=>{
    res.send('survey server is running')
})

// where the server port is
app.listen(port, ()=>{
    console.log(`survey is running on port: ${port}`)
})