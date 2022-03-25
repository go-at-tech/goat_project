const MongoClient = require('mongodb').MongoClient;
const URL = 'mongodb://localhost:27017';

MongoClient.connect(URL, (err, client) => {
  if (err) throw err;

  const db = client.db('chtbt_wp');
  
  db.createCollection('messages', (err, result) => {
    if (err) throw err;
    console.log('Koleksiyon oluşturuldu.');
    client.close();
  });
  
 /*
  var newDate = new Date();
  
  var ay = parseInt(newDate.getMonth())+1;

  var gunAyYil = newDate.getDate()+'/'+ay+'/'+newDate.getFullYear();
  var zaman = newDate.getHours()+':'+newDate.getMinutes();
  
  let veri = {
      
    gonderen: '+905465827921',
    alan: 'chatbot',//veya wp
    message:'deneme',
    tarih:gunAyYil,
    time:zaman,
    islem:0


    
    };
  db.collection('messages').insertOne(veri, (err, result) => {
    if (err) throw err;
    console.log('--Insert--')
    console.log(veri);
   
    
  });
  */

});