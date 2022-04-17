const express = require("express");
const { getRandomSentence, getResponseInterval } = require("./utils");
const MongoClient = require('mongodb').MongoClient;
const URL = 'mongodb://localhost:27017';
const PORT = process.env.PORT || 6000;
const app = express();
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "<connection string uri>";

const client = new MongoClient(URL);

async function run() {
    MongoClient.connect(URL, async (err, client) => {
        if (err) throw err;
        try {
            var length;
            const database = client.db("chtbt_wp");
            const movies = database.collection("messages");
            database.collection('messages').distinct(
                "gonderen",
                {}, // query object
                (async function(err, docs){
                    length = docs.length;
                })
                );
        
            // query for movies that have a runtime less than 15 minutes
            const query = {};
        
            const options = {
              // sort returned documents in ascending order by title (A->Z)
              sort: { gonderen: -1 },
              // Include only the `title` and `imdb` fields in each returned document
              projection: { _id: 0, gonderen: 1 },
            };
        
            const cursor = movies.find(query, options);
        
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
              console.log("No documents found!");
            }
            const arr = [];

            // replace console.dir with your callback to access individual elements
            await cursor.forEach( async function (res){
                if (!arr.includes(res.gonderen)){
                    arr.push(res.gonderen);
                    if(length == arr.length){
                        var users = [];
                        console.log(docs);
                        for(var i = 0; i < docs.length; i++){  
                             
                            let messages = {};
                            let arr = [];
                            const cursor = await db.collection('messages').find({gonderen: docs[i]});

                            while (await cursor.hasNext()) {
                                const doc = await cursor.next();
                                // do whatever, ex.
                                //console.log(doc);
                                var sender = 1;
                                if(doc.title){
                                    sender = null;
        
                                }
                                arr.push({
                                    content:doc.message,
                                    sender: sender,
                                    time:doc.time,
                                    status:null
        
                                
                                    });
                        
                              };
                                                        
                               //console.log('İÇ DÖNME ',result.length);

                               messages= {TODAY: arr};
                               
                               //var idsi = docs[i].split('@');
                               var idd = docs[i].substr(3,9);
                               var numm = docs[i].substr(1,11);
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
                                   //console.log(users);
                                   //console.log(messages);
                                  
                                   
                           
                            //console.log('',users);
                            
                           
                        }
                        socket.emit("users", users);
                    }

                }
                    
            });


            
          } finally {
            client.close();

          }
      });
  
}
run();



