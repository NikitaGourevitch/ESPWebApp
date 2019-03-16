//L'application requiert l'utilisation du module Express.
//La variable express nous permettra d'utiliser les fonctionnalités du module Express.
const Esp = require('./esp.js');
var express = require('express');
var espTest = new Esp("172.20.10.3","24","22","true","Bureau");
var espList = new Map();
// Nous définissons ici les paramètres du serveur.
var ip = require("ip");
var hostname = ip.address();
var port = 3000;

// Nous créons un objet de type Express.

const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());
var myRouter = express.Router();
myRouter.route('');

app.get('/radiator/:ip',function(req,res){
    res.status(200).json({message : "Vos informations ont bien été envoyées "+req.params.ip, methode : req.method, esp: espList.get(req.params.ip)});

});

app.post('/radiator',function(req, res) {

    espList.set(req.body.ip,new Esp(req.body.ip,req.body.tempNow,req.body.tempMin,req.body.radiatorOn,req.body.captorName,req.body.modeAuto));

    res.status(200).json({message : "Les données ont éte mises a jour ", methode : req.method, esp: espList.get(req.body.ip)});

});


app.get('/ApiRadiator',function(req,res){
    console.log("les valeurs");
    console.log( Array.from(espList.values()));
    res.status(200).json({message : "Tout les esp ont étes envoyées", methode : req.method , esp : Array.from(espList.values())});
});

app.post('/ApiRadiator',function(req, res) {
    console.log(req.body);
    console.log(req.esp);
    espList.set(req.body.ip,new Esp(req.body.ip,req.body.tempNow,req.body.tempMin,req.body.radiatorOn,req.body.captorName,req.body.modeAuto));
    res.status(200).json({message : "Bien mis a jour", methode : req.method, esp: espList.get(req.body.ip)});
    console.log(espList.get(req.body.ip));
});

app.use(myRouter);

app.listen(port, hostname, function(){
    console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port);
});