const express = require("express");
const { getRandomSentence, getResponseInterval } = require("./utils");
const MongoClient = require('mongodb').MongoClient;
const URL = 'mongodb://localhost:27017';
const PORT = process.env.PORT || 6001;
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
    
    setInterval(() => {
        const dbx = clientx.db('chtbt_wp');
  let sorgux = {islem:0};
  const cursor = dbx.collection('messages').find(sorgux).toArray((err, result) => {
    if (err) throw err;
    console.log(result);
    for(var i = 0; i < result.length; i++){
        console.log(result[i].gonderen);
        var numarasi = result[i].gonderen;
        db.collection('messages').updateOne({_id: result[i]._id}, { $set: { islem:1 }}, (err, resultx) => {
            if (err) throw err;
            console.log('Başarılı bir şekilde güncellendi.');
        });
            var mesajlar = ['Merhaba','nasılsın','iyidir','sorum var','soru soracağım','deneme','deneme yapıyrum','deneme mesajı'];
            //var sallama = Math.floor(Math.random() * 10).toString+Math.floor(Math.random() * 10).toString+Math.floor(Math.random() * 10).toString+Math.floor(Math.random() * 10).toString+Math.floor(Math.random() * 10).toString+Math.floor(Math.random() * 10).toString+Math.floor(Math.random() * 10).toString+Math.floor(Math.random() * 10).toString+Math.floor(Math.random() * 10).toString;
            //var numara ='905'+sallama;
            var newDate = new Date();
            var random = Math.floor(Math.random() * mesajlar.length)
      
      var ay = parseInt(newDate.getMonth())+1;
    
      var gunAyYil = newDate.getDate()+'/'+ay+'/'+newDate.getFullYear();
      var zaman = newDate.getHours()+':'+newDate.getMinutes();
            let verix = {
                type: 'chat',
                gonderen: numarasi,//msg.notifyName
                alan: 'chatbot' ,//veya wp yada msg.to burda mesajı python işleme sokup wp ye döndüğünü görünce güncelleyerek wp yapmalı
                message:mesajlar[random],
                tarih:gunAyYil,
                time:zaman,
                islem:1,
                title:'biseyler'
            
            
                
                };
            setTimeout(() => {db.collection('messages').insertOne(verix, (err, result) => {
                if (err) throw err;
                console.log('Başarılı bir şekilde eklendi.');
               
            });},5000);
          
    }
   
  });
        
    },5000);
  
	
            
           
            
           
            
			

});
