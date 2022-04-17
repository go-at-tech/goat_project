import React, { useRef, useEffect } from 'react';

import "./styles/main.css";
import avatar from "assets/images/profile-picture-girl-1.jpeg";
import Icon from "components/Icon";
import Alert from "./Alert";
import Contact from "./Contact";
import OptionsBtn from "components/OptionsButton";
import { useUsersContext } from "context/usersContext";
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';

const scrollToRef = (ref) => window.scrollTo(0, 1000)   

const Sidebar = () => {
	const { users: contacts } = useUsersContext();
	const listInnerRef = useRef();
	const myRef = useRef(null);
	const executeScroll = () => scrollToRef(myRef)

  const onScroll = () => {
	
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        // TO SOMETHING HERE
        console.log('Reached bottom',scrollHeight);
		loadFunc();
      }else{
		if((scrollTop + clientHeight )  < 1440  || scrollTop == 0){
			delloadFunc();
			console.log('DEL LOAD ÇALIŞACAK',scrollTop);
			executeScroll();
			
		}
	  }
	  console.log('DEGER',scrollTop+clientHeight);
	  console.log('SCrollheight',scrollHeight );
	
	 
    }
  };
const loadFunc = () => {
	
	axios.get('http://localhost:6000/1')
	.then(res => {
	  console.log('girdi');
	})
}
const delloadFunc = () => {
	
	axios.get('http://localhost:6000/2')
	.then(res => {
	  console.log('girdi');
	})
}//require('../../images/indir.png')

const arama = (event) => {
	console.log(event.target.value);
	axios.get('http://localhost:6000/aramanumara/'+event.target.value)
	.then(res => {
	  console.log('girdi');
	})
}
	return (
		<aside className="sidebar">
			<header className="header">
				<div className="sidebar__avatar-wrapper">
					<img src={'http://localhost:6000/display/indir.png'} alt="Icon" className="avatar" />
				</div>
				<div className="sidebar__actions">
					
					<button className="sidebar__action" aria-label="New chat">
						<Icon id="chat" className="sidebar__action-icon" />
					</button>
					<OptionsBtn
						className="sidebar__action"
						ariaLabel="Menu"
						iconId="menu"
						iconClassName="sidebar__action-icon"
						options={[
							
							"Log out",
						]}
					/>
				</div>
			</header>
			<Alert />
			<div className="search-wrapper">
				<div className="search-icons">
					<Icon id="search" className="search-icon" />
					<button className="search__back-btn">
						<Icon id="back" />
					</button>
				</div>
				<input className="search" onChange={arama} placeholder="Aratın veya yeni sohbet başlatın" />
			</div>
			<div className="sidebar__contacts" onScroll={() => onScroll()} ref={listInnerRef}>
				
			
{contacts.map((contact, index) => (
					<Contact key={index} contact={contact} />
				))}

			</div>
		</aside>
	);
};

export default Sidebar;
