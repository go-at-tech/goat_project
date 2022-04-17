const express = require("express");
const bodyParser = require("body-parser");
var fs = require('fs');

const { getRandomSentence, getResponseInterval } = require("./utils");
const MongoClient = require('mongodb').MongoClient;
const URL = 'mongodb://127.0.0.1:27017';
const PORT = process.env.PORT || 6000;
const app = express();
const server = app.listen(PORT, () => console.log("Server running..."));

const cors = require('cors')
const multer = require('multer')
let foto_path = '';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
      var id = Math.random().toString(16).slice(2)+'.png';
      foto_path = id;
    cb(null, id)
  },
})

const upload = multer({ storage: storage })

app.use(cors())


const io = require("socket.io")(server, { cors: { origin: "*" } });
let sayi = 20;
let sayiconvo = 50;
let saniye = 500;
let cek_numara;
let arama_numara = '';
app.get("/", (req, res) => {
	// Health Check
    
	res.send("This service is up and running...");
});
app.get("/aramanumara/:number", (req, res) => {
	// Health Check
    res.header("Access-Control-Allow-Origin", "*");
    arama_numara = req.params.number;
	res.send("This service is up and running...");
});
app.get('/display/:name', function(req, res) {
    fs.readFile('images/'+req.params.name, function(err, data) {
      if (err) throw err; // Fail if the file can't be read.
      else {
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(data); // Send the file data to the browser.
      }
    });
  });

app.get("/1", (req, res) => {
	// Health Check
    res.header("Access-Control-Allow-Origin", "*");

    if(sayi < 100){
        sayi = sayi*2;
    saniye = saniye*2;
    console.log(sayi);
    }else{
        sayi = 100;
        saniye = 1000;
    }

	res.send("This service is up and 1...");
});
app.get("/2", (req, res) => {
	// Health Check
    console.log(sayi);
    res.header("Access-Control-Allow-Origin", "*");
    if(sayi > 20){
        sayi = 20;
    saniye = 500;
    }
	res.send("This service is up and 2...");
});
/*
Convo içersinde yüklemeleri yaptığım yer şuanlık dursun admin panelde takip yeri koyucam bunun için eğer
çok artıyorsa uygun bir yapı düşünücez

app.get("/1convo", (req, res) => {
	// Health Check
    console.log(sayi);
    res.header("Access-Control-Allow-Origin", "*");
   
        sayiconvo = sayiconvo*2;
    
	res.send("This service is up and 2...");
});
app.get("/2convo", (req, res) => {
	// Health Check
    console.log(sayi);
    res.header("Access-Control-Allow-Origin", "*");
   
       sayiconvo = 50;
    
	res.send("This service is up and 2...");
});
*/


app.get("/3/:tel?", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    //burada tüm numaraların son mesajı çekiliyo ancak girdiği zaman sadece o numaranın mesajlarını çekiyor
	cek_numara = req.params.tel;
	res.send("This service is up and 3..."+cek_numara);
});
MongoClient.connect(URL, {
    // retry to connect for 60 times
    reconnectTries: 60,
    // wait 1 second before retrying
    reconnectInterval: 1000
}, (err, clientx) => {
	if (err) throw err;
    app.post("/newChat", (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        //burada tüm numaraların son mesajı çekiliyo ancak girdiği zaman sadece o numaranın mesajlarını çekiyor
        var cek_numara = req.body.tel;
        var text = req.body.tex;
        let veri = {
            type: 'chat',
            gonderen: cek_numara,//msg.notifyName
            alan: 'wp',//veya wp yada msg.to burda mesajı python işleme sokup wp ye döndüğünü görünce güncelleyerek wp yapmalı
            message: text,
            tarih:gunAyYil,
            time:new Date().toLocaleTimeString(),
            islem:1,
            unread:0,
            title:'1'
        
        
            
            };
            const db = clientx.db('chtbt_wp');

        db.collection('messages').insertOne(veri, (err, result) => {
            if (err) throw err;
            console.log('Başarılı bir şekilde newChat eklendi.');
           
        });
        res.send("This service is up and 3..."+cek_numara);
    });
    app.post('/image', upload.single('file'), function (req, res) {
        res.json({});
        try {
            var newDate = new Date();
        var ay = parseInt(newDate.getMonth())+1;
        var gunAyYil = newDate.getDate()+'/'+ay+'/'+newDate.getFullYear();
        var kisi = req.body.kisii;
        let veri = {
            type: 'image',
            gonderen: kisi,//msg.notifyName
            alan: 'wp',//veya wp yada msg.to burda mesajı python işleme sokup wp ye döndüğünü görünce güncelleyerek wp yapmalı
            message:'http://localhost:6000/display/'+foto_path,
            tarih:gunAyYil,
            time:new Date().toLocaleTimeString(),
            islem:1,
            unread:0,
            title:'1'
        
        
            
            };
            const db = clientx.db('chtbt_wp');

        db.collection('messages').insertOne(veri, (err, result) => {
            if (err) throw err;
            console.log('Başarılı bir şekilde foto eklendi.');
           
        });
        } catch (error) {
           console.log(error); 
        }
        
      })
  
	const db = clientx.db('chtbt_wp');
    app.get("/delunread/:tel?", (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        //unreadlar 0 oluyor
        cek_numara = req.params.tel;
        const db = clientx.db('chtbt_wp');
        let sorgusu = { gonderen: cek_numara };
        let setle = { $set: { unread:0 } };
        db.collection('messages').updateMany(sorgusu, setle, (err, result) => {
          if (err) throw err;
          console.log('Başarılı bir şekilde güncellendi.');
          
        });

        res.send("This service is up and delunread..."+cek_numara);
    });
    
	io.on("connection", (socket) => {
        
		setInterval( () => {
            

            async function run() {
                MongoClient.connect(URL, async (err, client) => {
                    
                    if (err) throw err;
                    try {
                        app.get("/alive", (req, res) => {
                            // Health Check
                            res.header("Access-Control-Allow-Origin", "*");
                        
                            
                        
                            res.send("is alive...");
                        });
                        socket.on('wp_mesajat',(veri)=>{
                            const db = clientx.db('chtbt_wp');

                            db.collection('messages').insertOne(veri, (err, result) => {
                                if (err) throw err;
                                console.log('Başarılı bir şekilde wp verisi eklendi.');
                               
                            });
                            //Messages kaydedildi wp web js göndermesi için send_messagese kaydetme 

                        });
                        
                        
                        
                        var length;
                        const database = client.db("chtbt_wp");
                        const movies = database.collection("messages");
                        database.collection('messages').distinct(
                            "gonderen",
                            {}, // query object
                            (async function(err, docs){
                                //console.log(docs);
                                length = docs.filter(function(value) { return value !== undefined }).length;
                            })
                            );
                    
                        const query = {};
                      
                        const options = {
                          // sort returned documents in ascending order by title (A->Z)
                          sort: { _id: -1 },
                          // Include only the `title` and `imdb` fields in each returned document
                          projection: { _id: 0, gonderen: 1 },
                        };
                    
                        const cursor = movies.find(query, options);
                    
                        // print a message if no documents were found
                        if ((await cursor.count()) === 0) {
                          console.log("No documents found!");
                        }
                        const arr = [];
            
                        // Numarların sırayla geldiği biyerde o numaranın son mesajının alanı kim ona göre chtbt veya wp yönlendirme yapılması olacak
                        await cursor.forEach( async function (res){
                            if (!arr.includes(res.gonderen) ){
                                //console.log('arr length',arr.length);
                                //console.log('length',length);
                                
                                arr.push(res.gonderen);
                                
                                //console.log(arr);
                                //console.log('length:',length);
                                //console.log('arr.length : ',arr.length);
                                if(length == arr.length ){//distinct ile kaç kişi konuştuk uniqe ona bakıldı sonra sıraladık 
                                    var users = [];
                                    var wp = [];
                                    //slice ile listelenmesi gereken chat sayısı
                                    docs = arr.slice(0, sayi);
                                    if(cek_numara != undefined){
                                        docs.push(cek_numara);
                                    }
                                    console.log('docs',docs);
                                    /*if(arama_numara){
                                        var found = docs.find(function (element) {
                                            return element == arama_numara;
                                        });
                                        if(found != undefined){
                                            docs = [arama_numara];
                                        }
                                        ARAMA YERİ İÇİN 
                                        
                                    }
                                    */
                                    //console.log('Fetch chat length:',docs.length);
                                    //console.log(docs);
                                    
                                    for(var i = 0; i < docs.length; i++){  
                                         
                                        let messages = {};
                                        let arr = [];
                                        const cursorxx = await db.collection('messages').find({gonderen: docs[i]});
                                        
                                        const sort = { id: -1 };
                                        const limit = 1;
                                        const cursorn = await db.collection('messages').find({gonderen: docs[i]}).sort(sort).limit(limit);
                                        
                                        let durumu = '';
                                        var unreadi = 0;
                                            var sayiyor = 0;
                                            
                                                while (await cursorxx.hasNext()) {
                                            
                                                    const doc = await cursorxx.next();
                                                
                                                // do whatever, ex.
                                                //console.log(doc);
                                               
                                                if(doc.title){
                                                    sender = null;
                                                   
                        
                                                }else{
                                                    var sender = 1;
                                                }
                                                var imagesi = false;
                                                if(doc.type == 'image'){
                                                    imagesi = true;
    
                                                }
                                                
                                                arr.push({
                                                    content:doc.message,
                                                    sender: sender,
                                                    time:doc.time,
                                                    status:null,
                                                    image:imagesi
                        
                                                
                                                    });
                                                
                                                durumu = doc.alan;
                                                
                                                if(doc.unread){
                                                    unreadi = unreadi+1;
                                                }
                                                
                                              };
                                            
                                        
                                          if(cek_numara != '9'+docs[i].substr(1,11)){
                                            arr = arr.slice(arr.length-1,arr.length);
                                        }
                                            //console.log('ARR ',arr);                 
                                           //console.log('İÇ DÖNME ',result.length);
                                            //console.log(durumu);
                                           messages= {TODAY: arr};
                                           
                                           //var idsi = docs[i].split('@');
                                           var idd = docs[i].substr(3,9);
                                           var numm = docs[i].substr(1,11);
                                           
                                          if(durumu == 'chatbot'){
                                             // console.log('chatbot');
                                            users.push({
                                                id:parseInt(idd),
                                                profile_picture: 'https://cdn.pixabay.com/photo/2017/06/13/12/54/profile-2398783_1280.png',
                                                name: numm,
                                                phone_number: numm,
                                                whatsapp_name: numm,
                                                unread: 0,
                                                messages:messages,
                                                group: false,
                                                pinned: false,
                                                typing: false,
                        
                        
                                            
                                                });
                                          }else{
                                           // console.log('wp');
                                            wp.push({
                                                id:parseInt(idd),
                                                profile_picture: 'https://cdn.pixabay.com/photo/2017/06/13/12/54/profile-2398783_1280.png',
                                                name: numm,
                                                phone_number: numm,
                                                whatsapp_name: numm,
                                                unread: unreadi,
                                                messages:messages,
                                                group: false,
                                                pinned: false,
                                                typing: false,
                        
                        
                                            
                                                });

                                          }
                                               //console.log(users);
                                               //console.log(messages);
                                              
                                               
                                       
                                        //console.log('',users);
                                        
                                       
                                    }
                                    //users = users.slice(0, 5);
                                    socket.emit("users", users);
                                    socket.emit("wp", wp);
                                }
            
                            }
                                
                        });
            
            
                        
                      } finally {
                         
            
                      }
                     // client.close();

                  });
                  
                  
            }
            run();
            
           
            
			
		}, 500);
	});
    
    

});
