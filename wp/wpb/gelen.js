const express = require("express");
const { getRandomSentence, getResponseInterval } = require("./utils");
const MongoClient = require('mongodb').MongoClient;
const URL = 'mongodb://localhost:27017';
const PORT = process.env.PORT || 6003;
const app = express();
const server = app.listen(PORT, () => console.log("Server running..."));

const io = require("socket.io")(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
	// Health Check
	res.send("This service is up and running...");
});
MongoClient.connect(URL, (err, clientx) => {
	if (err) throw err;
  
	const db = clientx.db('chtbt_wp');
    
	setInterval( () => {
        var mesajlar = ['Merhaba','nasılsın','iyidir','sorum var','soru soracağım','deneme','deneme yapıyrum','deneme mesajı'];
        var sallama = (Math.floor(Math.random() * 10))+''+(Math.floor(Math.random() * 10))+''+(Math.floor(Math.random() * 10))+''+(Math.floor(Math.random() * 10))+''+(Math.floor(Math.random() * 10))+''+(Math.floor(Math.random() * 10))+''+(Math.floor(Math.random() * 10))+''+(Math.floor(Math.random() * 10))+''+(Math.floor(Math.random() * 10));
        var numara ='905'+sallama;
        var newDate = new Date();
        var random = Math.floor(Math.random() * mesajlar.length)
  
  var ay = parseInt(newDate.getMonth())+1;

  var gunAyYil = newDate.getDate()+'/'+ay+'/'+newDate.getFullYear();
  var zaman = newDate.getHours()+':'+newDate.getMinutes();
        let veri = {
            type: 'chat',
            gonderen: numara,//msg.notifyName
            alan: 'chatbot',//veya wp yada msg.to burda mesajı python işleme sokup wp ye döndüğünü görünce güncelleyerek wp yapmalı
            message:mesajlar[random],
            tarih:gunAyYil,
            time:zaman,
            islem:0
        
        
            
            };
        db.collection('messages').insertOne(veri, (err, result) => {
            if (err) throw err;
            console.log('Başarılı bir şekilde eklendi.');
           
        });
        
           
            
           
            
			
    }, 1000);


});
