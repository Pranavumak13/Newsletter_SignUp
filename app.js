const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

require('dotenv').config() // used for API hiding
// console.log(process.env) // remove this after you've confirmed it working


const app = express();
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static("public"))

app.get("/", function(req, res){

    res.sendFile(__dirname + '/signup.html');
    // res.send("HI!!");
})


app.post("/",function(req, res){
    const fNAME = req.body.firstName;
    const lNAME = req.body.lastName;
    const eMAIL = req.body.emailID;

    const data = {
        members: [
            {
                email_address: eMAIL,
                status: "subscribed",
                merge_fields:{
                    FNAME: fNAME,
                    LNAME: lNAME,
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = 'https://us10.api.mailchimp.com/3.0/lists/2046f6d21c';

    const options = {
        method: 'POST',
        auth: "pranav:7a48439b8258bad7aafc3da8b8487835-us10"
    }

    const request = https.request(url,options,function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html')
        }else
        {
            res.sendFile(__dirname + '/failure.html')
        }



        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Port has started!!");
})



// API KEY
// 7a48439b8258bad7aafc3da8b8487835-us10

// Audience/Unique/List ID
// 2046f6d21c