//////////////////////////////////////
////////////// ROUTES ////////////////
//////////////////////////////////////

// route.js - Add endpoints to the API

import express from 'express';
var router = express.Router();
import db from "./mongodb.js";


router.get("/api", async (req, res) => {
  res.send({ message: "hello" });
});

// 👉 add endpoint to retrieve data here (Chapter 10) ...

// get all the rows in the database
router.get("/api/feelings", async function (req, res) {
  let result = [];
  try {
    result = await db.getAll();
    if (!result) throw new Error('No data received');
  } catch (err) {
    result = []
  }
  res.json(result);
});




// 👈

// endpoint > post a row to the database
router.post("/api/feeling", async function (req, res) {
  let result = [];
  let data = [];
  try {
    console.log("POST -> /api/feeling", req.body);
    let doc = {
      "feeling": req.body.feeling,
      "color": req.body.color,
      "lat": req.body.lat || "",
      "lng": req.body.lng || "",
      "id": randomStr() + randomStr(),
      "datetime": new Date()
    }
    result = await db.addOne(doc);
    data = await db.getAll();
  } catch (err) {
    result = { message: err }
  }
  res.json(data);
});
const randomStr = () => Math.random().toString(36).slice(-5);



//////////////////////////////////////
//////////// TEST ROUTES /////////////
//////////////////////////////////////

// TEST ROUTES
// - endpoints accessed directly and then redirect browser back to index.html
// - turn these off in public version

router.get("/test", async (req, res) => {
  res.send(template("/test", "Hello from Express on Vercel"));
});

router.get('/test/error', async function (req, res) {
  // Express will catch this on its own.
  throw new Error('This is a test error thrown in the route handler');
})
router.get('/test/dberror', async function (req, res) {
  let result = await db.dberror();
  res.send(template("/test/dberror", result));
})
router.get('/test/dberrorcaught', async function (req, res) {
  let result;
  try {
    result = await db.dberror();
  }
  catch (err) {
    result = err;
  }
  res.send(template("/test/dberrorcaught", `dberrorcaught... ${JSON.stringify(result)}`));

})

router.get("/test/pingDatabase", async (req, res) => {
  let result;
  try {
    result = await db.pingDatabase();
  }
  catch (err) {
    console.log("Problem with getAll()", err);
    result = err;
  }
  res.send(template("/testConnection", `Database connection is... ${JSON.stringify(result)}`));
});

router.get("/test/getAll", async (req, res) => {
  let result;
  let output = "";
  try {
    result = await db.getAll()
    console.log("result", result);
    if (!result) throw new Error('No data received');
    result.forEach(element => {
      output += `<pre>${JSON.stringify(element)}</pre>`
    });
  } catch (err) {
    output = err
  }
  res.send(template("/test/getAll()", output));
});

router.get("/test/addTestDataSingle", async (req, res) => {
  let response = await db.addTestDataSingle()
  res.send(template("/test/addTestDataSingle()", `<pre>${JSON.stringify(response)}</pre>`));
});

router.get("/test/addTestDataMultiple", async (req, res) => {
  let response = await db.addTestDataMultiple()
  res.send(template("/test/addTestDataMultiple()", `<pre>${JSON.stringify(response)}</pre>`));
});

// remove all database entries
router.get("/test/deleteAll", async function (req, res) {
  let response = await db.deleteAll();
  res.send(template("/test/deleteAll()", `<pre>${JSON.stringify(response)}</pre>`));
});


const testingLinks = [
  '/',
  '/test',
  '/test/error',
  '/test/dberror',
  '/test/dberrorcaught',
  '/test/pingDatabase',
  '/test/getAll',
  '/test/addTestDataSingle',
  '/test/addTestDataMultiple',
  // '/test/deleteAll',
  '/api',
  '/api/feelings'
]

const template = (title, str) => {
  let links = `<html><head><style>body{font:16px Arial; margin: 1rem;"</style></head><body><div> <a href="/">Home</a>`
  testingLinks.forEach((link) => {
    links += ` <a href="${link}">${link}</a> `
  })
  links += `</div> <h3>${title}</h3>${str}</body></html>`;
  return links;
}




//   // 👉 add test data endpoint here (Chapter 10) ...

//   // add test data
//   server.get("/addTestData", async function (request, reply) {
//     await db.addTestData();
//     reply.redirect("/");
//   });

//   // 👈
// };
// 


export default router;