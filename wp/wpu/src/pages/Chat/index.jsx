import React, { useEffect, useRef, useState } from "react";
import "./styles/main.css";
import EmojiTray from "./components/EmojiTray";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";
import ChatSidebar from "./components/ChatSidebar";
import Icon from "components/Icon";
import Search from "./components/Search";
import Profile from "./components/Profile";
import Convo from "./components/Convo";
import { useUsersContext } from "context/usersContext";
import io from "socket.io-client";
import axios from 'axios';
import { useWindowScrollPositions } from './components/postion';


const SOCKET_URL = window.location.origin.includes("localhost")
	? "http://localhost:6000"
	: "https://whatsapp-web-clone-backend.herokuapp.com/";

const socket = io.connect(SOCKET_URL);
const Chat = ({ match, history }) => {
	const [newusers, setNewusers] = useState();

	const { users, setUserAsUnread, addNewMessage } = useUsersContext();

	/*
	socket.on("users", (users) => {
		console.log('geldi',users);
		setUsersx(users);
	  });
	 console.log('USERS : ',users);
	 */
	const userId = match.params.id;
	let user = users.filter((user) => user.id === Number(userId))[0];
	
	var path = window.location.pathname.split('/')[2];
	//console.log('ESİTLEME',esitleme);

	if(path.length == 8){
		path = '0'+path;
	}
	

	axios.get('http://localhost:6000/3/905'+path)
	.then(res => {
	  console.log('girdi');
	  
	})
	axios.get('http://localhost:6000/delunread/905'+path)
	.then(res => {
	  console.log('girdi');
	  
	})
	const lastMsgRef = useRef(null);
	const [showAttach, setShowAttach] = useState(false);

	const [showEmojis, setShowEmojis] = useState(false);
	const [showProfileSidebar, setShowProfileSidebar] = useState(false);
	const [showSearchSidebar, setShowSearchSidebar] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [scrollT, setScrollT] = useState(0);
	const [scrollH, setScrollH] = useState(0);
	const [yukari, setYukari] = useState(false);
	const [assagi, setAssagi] = useState(false);



	const listInnerRef = useRef();
	const onScroll = () => {
	
		if (listInnerRef.current) {
		  const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
		 
		  console.log('SCROLL TOPP',scrollTop+clientHeight);
		  console.log('SCrollheight',scrollHeight );
		  console.log('Client Height',clientHeight);
		  setScrollT(scrollTop+clientHeight);
		  setScrollH(scrollHeight);
		 /* if(scrollT ==418){
			axios.get('http://localhost:6000/1convo')
	.then(res => {
	  console.log('girdi');
	  
	})
		}
		if(scrollH - scrollT <= 1000 && scrollH - scrollT>0  ){
			axios.get('http://localhost:6000/2convo')
	.then(res => {
	  console.log('girdi');
	  
	})
		}
		*/
		 
		}
	  };
	

	useEffect(() => {
		if (!user){
			scrollToLastMsgx();
		}
		else {
			scrollToLastMsgx();
			setUserAsUnread(user.id);
		}
	}, []);


	useEffect(() => {
		console.log('SAYİSİ   : ',newusers);
		console.log('LENTGTSİ   : ',user.messages.TODAY.length);
		
		if(scrollT<scrollH){
			user && scrollToLastMsg();
		}else{
			user && scrollToLastMsgx();
		}
		
		
		
	}, [users]);

	const openSidebar = (cb) => {
		// close any open sidebar first
		setShowProfileSidebar(false);
		setShowSearchSidebar(false);

		// call callback fn
		cb(true);
	};

	const scrollToLastMsg = () => {
		//lastMsgRef.current.scrollIntoView();
	};
	const scrollToLastMsgx = () => {
		lastMsgRef.current.scrollIntoView();
	};

	const submitNewMessage = () => {
		addNewMessage(user.id, newMessage);
		setNewMessage("");
		scrollToLastMsg();
	};
	

	return (
		<div className="chat">
			<div className="chat__body">
				<div className="chat__bg"></div>

				<Header
					user={user}
					openProfileSidebar={() => openSidebar(setShowProfileSidebar)}
					openSearchSidebar={() => openSidebar(setShowSearchSidebar)}
				/>
				<div className="chat__content" onScroll={() => onScroll()} ref={listInnerRef}>
					<Convo  lastMsgRef={lastMsgRef} messages={user.messages} />
				</div>
				<footer className="chat__footer">
					<button
						className="chat__scroll-btn"
						aria-label="scroll down"
						onClick={scrollToLastMsgx}
					>
						<Icon id="downArrow" />
					</button>
					<EmojiTray
						showEmojis={showEmojis}
						newMessage={newMessage}
						setNewMessage={setNewMessage}
					/>
					<ChatInput
						showEmojis={showEmojis}
						setShowEmojis={setShowEmojis}
						showAttach={showAttach}
						setShowAttach={setShowAttach}
						newMessage={newMessage}
						setNewMessage={setNewMessage}
						submitNewMessage={submitNewMessage}
					/>
				</footer>
			</div>
			<ChatSidebar
				heading="Search Messages"
				active={showSearchSidebar}
				closeSidebar={() => setShowSearchSidebar(false)}
			>
				<Search />
			</ChatSidebar>

			<ChatSidebar
				heading="Contact Info"
				active={showProfileSidebar}
				closeSidebar={() => setShowProfileSidebar(false)}
			>
				<Profile user={user} />
			</ChatSidebar>
		</div>
	);
};

export default Chat;
