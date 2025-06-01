/**
 *   MongoDB (Simple) - Owen Mundy 2025
 */

//////////////////////////////////////
////////////// PARAMS ////////////////
//////////////////////////////////////

// cluster > database > table
const dbName = "bigFeelings"; // i.e. "database"
const collectionName = "feelings"; // i.e. "table"

//////////////////////////////////////
/////////////// SETUP ////////////////
//////////////////////////////////////

// import mongo driver
import { MongoClient } from 'mongodb';
// import dotenv utility
import { } from 'dotenv/config';
//console.log("test", process.env.MONGODB_URI)

// confirm the .env file contains the MONGODB_URI variable
if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
// save your MongoDB connection string
const uri = process.env.MONGODB_URI;

// module-scoped variables
let client, clientPromise, database, collection;

// create db connection
async function connectToDatabase() {
    try {
        // create MongoDB client, and scoped promise
        client = new MongoClient(uri, {});
        clientPromise = await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB!");
        // create database reference
        database = await client.db(dbName);
        collection = await database.collection(collectionName);
    } catch (err) { console.log("Problem connecting to database", err) }
}
connectToDatabase();

// close connection when server finishes/errors
process.on('SIGINT', async function () {
    await client.close();
    console.log('Database disconnected on app termination');
    process.exit(0);
});

//////////////////////////////////////
/////////// PUBLIC FUNCTIONS /////////
//////////////////////////////////////

const db = {
    connect: async () => {
        return connectToDatabase();
    },
    pingDatabase: async () => {
        return await client.db("admin").command({ ping: 1 });
    },
    getAll: getAll,
    addOne: addOne,
    dberror: async () => {
        return new Error('This is a test error thrown in mongodb.js');
    },
    deleteAll: async () => {
        return deleteAll();
    },
    addTestDataSingle: async () => {
        return addTestDataSingle();
    },
    addTestDataMultiple: async () => {
        return addTestDataMultiple();
    },
};
export default db;

//////////////////////////////////////
//////////// DB FUNCTIONS ////////////
//////////////////////////////////////

async function getAll() {
    // return await collection.find({}).toArray();
    try {
        const feelings = await collection.find({}).toArray();
        // console.log(feelings)
        return feelings;
    } catch (err) { console.log("Problem with getAll()", err) }
}
async function addOne(doc) {
    try {
        let docs = []
        docs.push(doc)
        console.log("✅ addOne() - Fata added!");
        // Insert the documents into the specified collection        
        return await addTestDocument(docs);
    } catch (err) { console.error("Problem with addOne()", err) }
}


//////////////////////////////////////
////////////// DEBUGGING /////////////
//////////////////////////////////////

async function addTestDataSingle() {
    try {
        let docs = []
        // docs.push({
        //     "feeling": "Totz Bored",
        //     "color": "#FF2E24",
        //     "lat": 32.067665100,
        //     "lng": 34.776332855,
        //     "datetime": new Date(2025, 5, 7),  // May 7, 1954                                                                                                                                  
        // })
        docs.push(creatTestDocument())
        console.log("✅ addTestDataSingle() - Test data added!");
        // Insert the documents into the specified collection        
        return await addTestDocument(docs);
    } catch (err) { console.error("Problem with addTestDataSingle()", err) }
}

// Adds multiple new rows
async function addTestDataMultiple(count = 50) {
    try {
        let docs = [];
        // Create new documents   
        for (let i = 0; i < count; i++) {
            docs.push(await creatTestDocument());
        }
        console.log("✅ addTestDataMultiple() - Test data added!");
        return await addTestDocument(docs);
    } catch (err) { console.error("Problem with addTestDataMultiple()", err) }
}

// Add a new test row
async function addTestDocument(docs) {
    // console.log(docs);
    try {
        // Insert the documents into the specified collection        
        const response = await database.collection(collectionName).insertMany(docs, { ordered: false }, function (err, docs) {
            console.log("✅ addTestDocument()", err, docs);
        });
        return response;
    } catch (err) { console.log("Problem with addTestDocument()", err) }
}

// Deletes all data in the table
async function deleteAll() {
    database.collection(collectionName).deleteMany({})
    console.log("✅ Table is empty");
}

//////////////////////////////////////
/////////////// HELPERS //////////////
//////////////////////////////////////

// import colors from "../public/assets/js/colors.js";

import * as fs from "fs";
let colors;

try {
    colors = JSON.parse(fs.readFileSync("./public/assets/data/colors.json"));
}
catch (err) {
    throw new Error('Cant import colors');
}



import testGeo from "./data/test-geo.js";

// creates data for a row
function creatTestDocument() {
    let data = colors[Math.floor(Math.random() * colors.length)];
    let testGeo = randomLatLng() || "";
    data._id = randomStr() + randomStr();
    data.lat = Number(testGeo.latitude || "");
    data.lng = Number(testGeo.longitude || "");
    data.datetime = new Date();
    // console.log("creatTestDocument()", data);
    return data;
}

const randomStr = () => Math.random().toString(36).slice(-5);

function randomLatLng() {
    // too random
    // data.lat = randomNumber(-60,60);
    // data.lng = randomNumber(-140,150);
    return testGeo[Math.floor(Math.random() * testGeo.length)];
}

function randomNumber(min, max) {
    min = Number(min);
    max = Number(max);
    return Math.random() * (max - min) + min;
}
