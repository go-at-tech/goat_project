const express = require("express");
const { getRandomSentence, getResponseInterval } = require("./utils");
const MongoClient = require('mongodb').MongoClient;
const URL = 'mongodb://localhost:27017';
const PORT = process.env.PORT || 6004;
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
    
	
        for(var xx = 0; xx < 5; xx++){
            var mesajlar = ["Lorem Ipsum rsions of Lorem Ipsum.","sda","sdas","xasxsax","asdasd","12asd"];
        var sallama = ['358563179','428684605'];
        var numara ='905551703959';
        var newDate = new Date();
        var random = Math.floor(Math.random() * mesajlar.length)
  
  var ay = parseInt(newDate.getMonth())+1;
  var idsi = "id" + Math.random().toString(16).slice(2)

  var gunAyYil = newDate.getDate()+'/'+ay+'/'+newDate.getFullYear();
  var zaman = newDate.getHours()+':'+newDate.getMinutes();
        let veri = {
          
            type: 'chat',
            gonderen: numara,//msg.notifyName
            alan: 'wp',//veya wp yada msg.to burda mesajı python işleme sokup wp ye döndüğünü görünce güncelleyerek wp yapmalı
            message:xx,
            tarih:gunAyYil,
            time:new Date().toLocaleTimeString(),
            islem:0,
            unread:1,
            title:'1'
        
        
            
            };
        
            db.collection('messages').insertOne(veri,{upsert:true}, (err, result) => {
                if (err) throw err;
                console.log('Başarılı bir şekilde eklendi.');
               
            });
        
        }
        
           
            
           
            
			
    


});
