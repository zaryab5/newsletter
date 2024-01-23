import dotenv from "dotenv";
import bodyParser from "body-parser";
import express, { Router } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import cors from "cors";

dotenv.config();

const app = express();


app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("dist"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
});

app.get("/s", (req, res) => {
    res.sendFile(__dirname + "/dist/success.html");
});

app.post("/", (req, res) => {
    console.log(req.body);
    const fname = req.body.fname;
    const email = req.body.email;
    const lname = req.body.lname;
    const checkbox = req.body.checkbox;

    const obj = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname

                }

            }
        ]
    };

    try {
        const jsonData = JSON.stringify(obj);
        const url = process.env.URL;
        const op = {
            method: "POST",
            auth: "kxhb:" + process.env.KEY
        };
    
        const request = https.request(url, op, (response) => {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/dist/success.html");
            } else {
                res.sendFile(__dirname + "/dist/failure.html");
            }
        });
    
        request.write(jsonData);
        request.end();
    } catch (error) {
        console.error("Error in https.request:", error);
        res.sendFile(__dirname + "/dist/failure.html");
    }
    

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
    console.log("Working...");
});






