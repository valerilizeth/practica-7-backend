// const { MongoClient, ServerApiVersion } = require('mongodb');
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://xevazariasd:o6HI3tlQcwXdgSe2@curso-full-stack.nplza2v.mongodb.net/?retryWrites=true&w=majority&appName=Curso-Full-Stack";// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export default client