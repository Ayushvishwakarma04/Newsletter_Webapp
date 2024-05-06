const express = require("express");
const bodyParser = require("body-parser");
//const request = require ("request");
const app= express();
const https = require("https");

app.use(express.static("public")); //static to access the local files on server
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const FirstName=req.body.Firstname;
    const LastName=req.body.Lastname;
    const Email=req.body.Email;
    const data={
        members: [{
            email_address: Email,
            status: "subscribed",
            merge_fields: {
                FNAME: FirstName,
                LNAME: LastName 
            }
        }]
    };
    const jsondata=JSON.stringify(data)
    const url = "https://us18.api.mailchimp.com/3.0/lists/888566541a";
    const options = {
        method: "POST",
        auth: "" //API KEY
    }
    const request = https.request(url,options,function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    })
    request.write(jsondata);
    request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000,function(){ //to run on heroku
    console.log("Server running on 3000");
});
