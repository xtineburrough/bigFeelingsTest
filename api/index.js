//////////////////////////////////////
/////////////// SERVER ///////////////
//////////////////////////////////////

// create express server
import express from "express";
const app = express();

// make all files inside /public available using static
import path from "path";
import { URL } from "url";
const __filename = new URL("", import.meta.url).pathname;
const __dirname = new URL(".", import.meta.url).pathname;
app.use(express.static(path.join(__dirname, '../public')));


app.use(express.json());


import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true // support hierarchical data
}));

import morganBody from 'morgan-body';
morganBody(app, {logAllReqHeader:true, maxBodyLength:5000});

app.use(function(error, req, res, next) {
    console.log(req)
    next();
});


// allow access to all 
import cors from 'cors';
app.use(cors());

// add a separate file for routes
import router from './routes.js';
app.use('/', router);


// start server
app.listen(3000, () => console.log("Your app is listening at: http://localhost:3000."));

// export app for vercel
export default app;
