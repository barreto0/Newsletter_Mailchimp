const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
//const superagent = require("superagent");


const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public")); //puxa o css e os assets daqui

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const email = req.body.email;
    console.log(nome,sobrenome,email);

    if(nome  === "" || sobrenome === "" || email === ""){
        res.sendFile(__dirname + "/failure.html");
    }else{

    const dados = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: nome,
                    LNAME: sobrenome
                }
            }
        ]
    }

    const dadosJSON = JSON.stringify(dados);

    const url = "https://usX.api.mailchimp.com/3.0/lists/key";

    const options = {
        method: "POST",
        auth: "barreto: key"
    }
    

    const request = https.request(url, options, function(response){
        response.on("data",function(data){
           // console.log(JSON.parse(data));
            console.log(response.statusCode);
        });

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
            $("#errorField").append(` <i>${response.statusCode}</i>`);
        }
    });

    request.write(dadosJSON);
    request.end();

    
    }
    
});

app.post("/success",function(req,res){
    res.redirect("/");
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){ // "process.env.PORT" necessário para o heroku usar a porta que ele quiser. 3000 é a porta para excutarmos localmente duh
    console.log("Servidor iniciou na porta:" + process.env.PORT);
});

// app.listen(3000, function(){
//     console.log("Servidor iniciou na porta 3000");
// });

//https://blooming-savannah-08569.herokuapp.com/