//MailChimp API: 879e0032e62251fb0a89984be657a9b6-us12
//Audience ID: f2a90d9233

const express = require("express");
const app = express(); //Create an instance of express

const bodyParser = require("body-parser");

const request = require("request");

const https = require("https");
const { response } = require("express");

// const pino = require("pino-http");
// app.use(pino);

//Set up the server
// app.listen(3000, function() {     //*This is the normal localhost server
//     console.log("Running on port 3000...")
// })

//This is the Heroku
app.listen(process.env.PORT || 3000, () => { //process.env.port is heroku OR on localhost 3000
    console.log("Running on Heorku OR on port 3000")
})

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/signup.html");
})

app.use(express.static("static")); //Because like the CDN, we using something thats not static. Usage: .static("file_path")
app.use(bodyParser.urlencoded({ extended: true })); //Need to tell the app  to use bodyParser

app.post("/", (req, res) => {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;


    //Creates a JSON object
    var data = {
            members: [{
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }]
        }
        //Turns the data of JSON obj into string with the JSOn format
    var jsonData = JSON.stringify(data);

    //Create a https request.
    //https.get() gets data from API,
    //https.request() sends data to API 

    var url = "https://us12.api.mailchimp.com/3.0/lists/f2a90d9233"

    var options = { //*This var option block is from Https, Node.js */
            method: "POST",
            auth: "sprittoo:879e0032e62251fb0a89984be657a9b6-us12"
        }
        //respond here is respoind from API
    const apiRequest = https.request(url, options, (response) => { //Parse the API url and https options into

        var statusCode = response.statusCode;
        if (statusCode == 200) {
            response.sendFile(__dirname + "/success.html");
        } else {
            response.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })

    })

    apiRequest.write(jsonData);
    apiRequest.end();


})