const express = require("express");
const app = express();
const studentsRoute = require("./routes/studens");
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const URL = 'mongodb://localhost:27017';

//middleware tanımlamaları.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${req.path} urline ${req.method} istek atılıyor...`);
  next();
});
app.use("/students", studentsRoute);

//sadece string dönmek istersek.
app.get("/api/status", (req, res, next) => {
  res.send("active");
});

app.get("/api/islem0", (req, res, next) => {
  MongoClient.connect(URL, (err, client) => {
    if (err) throw err;
  
    const db = client.db('chtbt_wp');
    let sorgu = {};
    db.collection('messages').find({islem:0}).toArray(function(err, result) {
      if (err) throw err;
      console.log('Sonuc : ',result);
      
    
  res.send({
    message: result
  });
 
    });
  
  });
});

app.get("/api/test/:type?/:tel?/:body?", (req, res, next) => {
 
  MongoClient.connect(URL, (err, clientx) => {
    if (err) throw err;
  
    const db = clientx.db('chtbt_wp');
    /*
    db.createCollection('messages', (err, result) => {
      if (err) throw err;
      console.log('Koleksiyon oluşturuldu.');
      client.close();
    });
    */
    let veri = {
      type: req.params.type,
      tel: req.params.tel,
      body: req.params.body,
      
  
  
      
      };
    db.collection('send_message').insertOne(veri, (err, result) => {
      if (err) throw err;
      console.log('--Insert--')
      console.log(veri);
      res.send(veri);
     
      //clientx.close();
    });
    
  });
});

//parametre alıp json dönmek istersek.
app.get("/api/allmessages/:name?", (req, res, next) => {
  MongoClient.connect(URL, (err, client) => {
    if (err) throw err;
  
    const db = client.db('chtbt_wp');
    let sorgu = {};
    db.collection('messages').find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      
    
  res.send({
    message: result
  });
 
    });
  
  });
});

//post isteği yapmak istersek.
app.post("/api/test", (req, res, next) => {
  res.send({
    message: `Welcome ${req.body.name || ""}`
  });
});

//Sayfa bulunamadı hatası için.
app.get("*", (req, res) => {
  res.status(400).send("Not found !!!");
});

app.listen(port, () => {
  console.log(`localhost:${port} -> Api is alive ! `);
});
