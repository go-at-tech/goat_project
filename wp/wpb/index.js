const express = require("express");
const { getRandomSentence, getResponseInterval } = require("./utils");
const MongoClient = require('mongodb').MongoClient;
const URL = 'mongodb://localhost:27017';
const PORT = process.env.PORT || 6000;
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

	io.on("connection", (socket) => {
		setInterval(() => {
			db.collection('send_message').find({}).toArray(function(err, result) {
				if (err) throw err;
				for(var i = 0; i<result.length;i++){
					idsi = result[i]._id;
					var tel = result[i].tel;
					var body = result[i].body;
					var type = result[i].type;
					var answer = result[i].answer;
					var title = result[i].title;
					var footer = result[i].footer; 
					socket.emit("mesaj_at", {
						tel: tel,
						body:body,
						type: type,
						answer: answer,
						title: title,
						footer:footer
					});
					let now = new Date();

					console.log('Working item : ',idsi,now);
					let sorgu = {_id:idsi};
					db.collection('send_message').deleteOne(sorgu, (err, result) => {
						if (err) throw err;
						console.log('Deleted item : ',idsi,now);
						
					});
				}
			
				
			 
			
			});
			
		}, 100);
	});


});