import { createContext, useContext, useEffect, useState } from "react";
import contacts from "data/contacts";
import { useSocketContext } from "./socketContext";
import axios from 'axios';

const UsersContext = createContext();

const useUsersContext = () => useContext(UsersContext);

const UsersProvider = ({ children }) => {
	const socket = useSocketContext();
	

	console.log('esli data : ',contacts);
	/*
	var contacts = '';
	socket.on("users", (users) => {
		contacts = users;
	  });
	  console.log(contacts);
	*/
	var path = window.location.pathname.split('/')[1];
	var kisipath = window.location.pathname.split('/')[2];
	  console.log('PATH : ',path);
	  
	const [users, setUsers] = useState(contacts);
	
	
	const _updateUserProp = (userId, prop, value) => {
		setUsers((users) => {
			const usersCopy = [...users];
			let userIndex = users.findIndex((user) => user.id === userId);
			const userObject = usersCopy[userIndex];
			usersCopy[userIndex] = { ...userObject, [prop]: value };
			return usersCopy;
		});
	};

	const setUserAsTyping = (data) => {
		const { userId } = data;
		_updateUserProp(userId, "typing", true);
	};

	const setUserAsNotTyping = (data) => {
		const { userId } = data;
		_updateUserProp(userId, "typing", false);
	};

	const fetchMessageResponse = (data) => {
		setUsers((users) => {
			const { userId, response } = data;

			let userIndex = users.findIndex((user) => user.id === userId);
			const usersCopy = JSON.parse(JSON.stringify(users));
			const newMsgObject = {
				content: response,
				sender: userId,
				time: new Date().toLocaleTimeString(),
				status: null,
			};

			usersCopy[userIndex].messages.TODAY.push(newMsgObject);

			return usersCopy;
		});
	};

	useEffect(() => {
		if(path == 'person'){
			socket.on("wp", (wp) => {
			console.log('VERİİİ',wp);
			setUsers(wp);

			
		  });
		}else{
			socket.on("users", (users) => {
				console.log('VERİİİ',users);
				setUsers(users);
			  });
		}
		

		
		
		socket.on("fetch_response", fetchMessageResponse);
		socket.on("start_typing", setUserAsTyping);
		socket.on("stop_typing", setUserAsNotTyping);
	}, [socket]);

	const setUserAsUnread = (userId) => {
		_updateUserProp(userId, "unread", 0);
	};

	const addNewMessage = (userId, message) => {
		console.log('USERIDSİ : ',userId);
		let userIndex = users.findIndex((user) => user.id === userId);
		const usersCopy = [...users];
		const newMsgObject = {
			content: message,
			sender: null,
			time: new Date().toLocaleTimeString(),
			status: 'sent',
		};

		var newDate = new Date();
  
		var ay = parseInt(newDate.getMonth())+1;

		var gunAyYil = newDate.getDate()+'/'+ay+'/'+newDate.getFullYear();
		var zaman = newDate.getHours()+':'+newDate.getMinutes();
        let veri = {
            type: 'chat',
            gonderen: '905'+userId.toString(),//msg.notifyName
            alan: 'wp',//veya wp yada msg.to burda mesajı python işleme sokup wp ye döndüğünü görünce güncelleyerek wp yapmalı
            message:message,
            tarih:gunAyYil,
            time:new Date().toLocaleTimeString(),
            islem:1,
            unread:0,
			title:'1'
        
        
            
            };

		
			usersCopy[userIndex].messages.TODAY.push(newMsgObject);
			setUsers(usersCopy);
		console.log('MSGGGGGGG MSGGGGG',message);
		if(message != ''){
			socket.emit("wp_mesajat", veri);
		}
	};

	return (
		<UsersContext.Provider value={{ users, setUserAsUnread, addNewMessage }}>
			{children}
		</UsersContext.Provider>
	);
};

export { useUsersContext, UsersProvider };
