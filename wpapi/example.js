const { Client, Location, List, Buttons, LocalAuth } = require('./index');
const MongoClient = require('mongodb').MongoClient;
const URL = 'mongodb://localhost:27017';
var qrcode = require('qrcode-terminal');
var io = require('socket.io-client');

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
  


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: false }
});

client.initialize();

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});


});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
    /*
    var idsi;
db.collection('send_message').find({}).toArray(function(err, result) {
    if (err) throw err;
    for(var i = 0; i<result.length;i++){
        idsi = result[i]._id;
        var tel = result[i].tel;
        var body = result[i].body;
        client.sendMessage(tel, body);
        let sorgu = {_id:idsi};
        db.collection('send_message').deleteOne(sorgu, (err, result) => {
            if (err) throw err;
            console.log('Deleted item : ',idsi);
            
        });
    }

    
 

});
*/

    
});


//Mesaj atma bölümü




const socket = io.connect('http://localhost:6000', {reconnect: true});

    

// Add a connect listener
socket.on('mesaj_at', function (socket) {
    console.log('socket',socket);
    if(socket.type == 'button'){
        /*
        var string = socket.body;
        var dizi = []; 
        
        var arr = (new Function("return [" + string+ "];")());
        //console.log(arr)
        let modifiedArr = arr.map(function(element){
            return element;
        });
        var bodysi = arr[0];
        var title = arr[2];
        var footer = arr[3];
        //console.log(modifiedArr[1]);
        modifiedArr[1].map(function(element){
            dizi.push({body:element['body']});
        });*/

        //let button = new Buttons(bodysi,dizi,title,footer);//seçiniz kısmına yeni parametre gönder response yolla

        //answer ile body ters kaydettik 
        var text = socket.answer;

        var string = text.substr(1);
                var string2 = string.substr(0,string.length-1);
                var dizi = string2.split(", ");
        var yenidizi = [];
        dizi.map(function(element){
                    var element = element.substr(1);
                    var elem = element.substr(0,element.length-1);
                    
                    yenidizi.push({body:elem});
                    console.log(yenidizi);
                    
                });
        
        //console.log(yenidizi);


        let boton = new Buttons(socket.body,yenidizi,socket.title,socket.footer)
        //let boton = new Buttons('Merhabalar, yardım almak istediğiniz butonu seçiniz.',[{body:'Ürün almak istiyorum'},{body:'Serviste cihazım var'},{body:'Ürün bende ama sorun yaşıyorum'},{body:'Reeder Sosyal'}],'Reeder Chatbot 🤖','')
        //let botonx = new Buttons('.',[{body:'Reeder Sosyal'}],'','')

        client.sendMessage(socket.tel+'@c.us', boton);
       // client.sendMessage(socket.tel, botonx);
    }else if(socket.type == 'chat'){
        client.sendMessage(socket.tel+'@c.us',socket.body);
    }else if(socket.type == 'image'){
        //var media = new MessageMedia("image/png", _base64.data, "indir.png")
    const media = MessageMedia.fromFilePath("2.jpg");


    client.sendMessage('905313837735@c.us', media, { caption: 'Here\'s your requested media.' });
    }

   

});

//--- Mesaj atma bölümü bitiş---


client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);
    var newDate = new Date();
  
  var ay = parseInt(newDate.getMonth())+1;

  var gunAyYil = newDate.getDate()+'/'+ay+'/'+newDate.getFullYear();
  var zaman = newDate.getHours()+':'+newDate.getMinutes();
   //905077476450@c.us
   const gonderen_numara = msg.from.split("@");

    //db de mesaj atan son kişi chatbot ile konuştuysa chatbottan devam eğer wp ise ve 1 günü geçmediyse wp devam
    let veri = {
        type: msg.type,
        gonderen: gonderen_numara[0],//msg.notifyName
        alan: 'chatbot',//veya wp yada msg.to burda mesajı python işleme sokup wp ye döndüğünü görünce güncelleyerek wp yapmalı
        message:msg.body,
        tarih:gunAyYil,
        time:zaman,
        islem:0
    
    
        
        };
   const sort = { id: -1 };
   const limit = 1;
   const cursorn =  db.collection('messages').find({gonderen: gonderen_numara[0]}).sort(sort).limit(limit);
   while (cursorn.hasNext()) {
                                            
    const docxx = await cursorn.next();
    if(docxx.alan == 'chatbot'){
        veri = {
            type: msg.type,
            gonderen: gonderen_numara[0],//msg.notifyName
            alan: 'chatbot',//veya wp yada msg.to burda mesajı python işleme sokup wp ye döndüğünü görünce güncelleyerek wp yapmalı
            message:msg.body,
            tarih:gunAyYil,
            time:zaman,
            islem:0,
            unread:0
        
        
            
            };

    }else if (docxx.alan == 'wp'){
        const myArraytarih = docxx.tarih.split("/");
        var tarih1gun = myArraytarih[0];
        var tarih1ay = myArraytarih[1];
        var tarih1yil = myArraytarih[2];
        var date1 = new Date(tarih1ay+'/'+tarih1gun+'/'+tarih1yil); //Verilen tarih
        var date2 = new Date(); //Anlık zaman
        var timeDiff = Math.abs(date1.getTime() - date2.getTime()); //İki tarihin integer farkı
        var diffSecs = Math.ceil(timeDiff / 1000*60*60)%24; //Sonuç
        if(diffSecs>24){
            veri = {
                type: msg.type,
                gonderen: gonderen_numara[0],//msg.notifyName
                alan: 'chatbot',//veya wp yada msg.to burda mesajı python işleme sokup wp ye döndüğünü görünce güncelleyerek wp yapmalı
                message:msg.body,
                tarih:gunAyYil,
                time:zaman,
                islem:0,
                unread:0,
            
            
                
                };
        }else{
            veri = {
                type: msg.type,
                gonderen: gonderen_numara[0],//msg.notifyName
                alan: 'wp',//veya wp yada msg.to burda mesajı python işleme sokup wp ye döndüğünü görünce güncelleyerek wp yapmalı
                message:msg.body,
                tarih:gunAyYil,
                time:zaman,
                islem:1,
                unread:1,
            
            
                
                };
        }
       
    }
   }


  
  db.collection('messages').insertOne(veri, (err, result) => {
    if (err) throw err;
    console.log('--Insert--')
    console.log(veri);
   
    //clientx.close();
  });

    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } else if (msg.body === '!ping') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'pong');

    } else if (msg.body.startsWith('!sendto ')) {
        // Direct send a new message to specific id
        let number = msg.body.split(' ')[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        let chat = await msg.getChat();
        chat.sendSeen();
        client.sendMessage(number, message);

    } else if (msg.body.startsWith('!subject ')) {
        // Change the group subject
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newSubject = msg.body.slice(9);
            chat.setSubject(newSubject);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body.startsWith('!echo ')) {
        // Replies with the same message
        msg.reply(msg.body.slice(6));
    } else if (msg.body.startsWith('!desc ')) {
        // Change the group description
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newDescription = msg.body.slice(6);
            chat.setDescription(newDescription);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body === '!leave') {
        // Leave the group
        let chat = await msg.getChat();
        if (chat.isGroup) {
            chat.leave();
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body.startsWith('!join ')) {
        const inviteCode = msg.body.split(' ')[1];
        try {
            await client.acceptInvite(inviteCode);
            msg.reply('Joined the group!');
        } catch (e) {
            msg.reply('That invite code seems to be invalid.');
        }
    } else if (msg.body === '!groupinfo') {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
                Group Details
                Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body === '!chats') {
        const chats = await client.getChats();
        client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
    } else if (msg.body === '!info') {
        let info = client.info;
        client.sendMessage(msg.from, `
            Connection info
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
        `);
    } else if (msg.body === '!mediainfo' && msg.hasMedia) {
        const attachmentData = await msg.downloadMedia();
        msg.reply(`
            Media info
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (length): ${attachmentData.data.length}
        `);
    } else if (msg.body === '!quoteinfo' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();

        quotedMsg.reply(`
            ID: ${quotedMsg.id._serialized}
            Type: ${quotedMsg.type}
            Author: ${quotedMsg.author || quotedMsg.from}
            Timestamp: ${quotedMsg.timestamp}
            Has Media? ${quotedMsg.hasMedia}
        `);
    } else if (msg.body === '!resendmedia' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const attachmentData = await quotedMsg.downloadMedia();
            client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
        }
    } else if (msg.body === '!location') {
        msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
    } else if (msg.location) {
        msg.reply(msg.location);
    } else if (msg.body.startsWith('!status ')) {
        const newStatus = msg.body.split(' ')[1];
        await client.setStatus(newStatus);
        msg.reply(`Status was updated to ${newStatus}`);
    } else if (msg.body === '!mention') {
        const contact = await msg.getContact();
        const chat = await msg.getChat();
        chat.sendMessage(`Hi @${contact.number}!`, {
            mentions: [contact]
        });
    } else if (msg.body === '!delete') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
            } else {
                msg.reply('I can only delete my own messages');
            }
        }
    } else if (msg.body === '!pin') {
        const chat = await msg.getChat();
        await chat.pin();
    } else if (msg.body === '!archive') {
        const chat = await msg.getChat();
        await chat.archive();
    } else if (msg.body === '!mute') {
        const chat = await msg.getChat();
        // mute the chat for 20 seconds
        const unmuteDate = new Date();
        unmuteDate.setSeconds(unmuteDate.getSeconds() + 20);
        await chat.mute(unmuteDate);
    } else if (msg.body === '!typing') {
        const chat = await msg.getChat();
        // simulates typing in the chat
        chat.sendStateTyping();
    } else if (msg.body === '!recording') {
        const chat = await msg.getChat();
        // simulates recording audio in the chat
        chat.sendStateRecording();
    } else if (msg.body === '!clearstate') {
        const chat = await msg.getChat();
        // stops typing or recording in the chat
        chat.clearState();
    } else if (msg.body === '!jumpto') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            client.interface.openChatWindowAt(quotedMsg.id._serialized);
        }
    } else if (msg.body === '!buttons') {
        let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'},{body:'bt3'},{body:'bt3'},{body:'bt3'},{body:'bt3'},{body:'bt3'},{body:'bt3'},{body:'bt3'}],'title','footer');
        client.sendMessage(msg.from, button);
    } else if (msg.body === '!list') {
        let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
        let list = new List('List body','btnText',sections,'Title','footer');
        client.sendMessage(msg.from, list);
    }
});

client.on('message_create', (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        // do stuff here
    }
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log(after); // message after it was deleted.
    if (before) {
        console.log(before); // message before it was deleted.
    }
});

client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    console.log(msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if(ack == 3) {
        // The message was read
    }
});

client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    console.log('join', notification);
    notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
    // User has left or been kicked from the group.
    console.log('leave', notification);
    notification.reply('User left.');
});

client.on('group_update', (notification) => {
    // Group picture, subject or description has been updated.
    console.log('update', notification);
});

client.on('change_state', state => {
    console.log('CHANGE STATE', state );
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});
});