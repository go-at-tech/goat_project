import React,{useState} from "react";
import Icon from "components/Icon";
//import Modal from 'react-modal';
import Popup from 'reactjs-popup';

const attachButtons = [
	{ icon: "attachRooms", label: "Choose room" },
	{ icon: "attachContacts", label: "Choose contact" },
	{ icon: "attachDocument", label: "Choose document" },
	{ icon: "attachCamera", label: "Use camera" },
	{ icon: "attachImage", label: "Choose image" },
];

const ChatInput = ({
	showAttach,
	setShowAttach,
	showEmojis,
	setShowEmojis,
	newMessage,
	setNewMessage,
	submitNewMessage,
}) => {
	const detectEnterPress = (e) => {
		if (e.key === "Enter" || e.keyCode === 13) {
			submitNewMessage();
		}
	};
	
	
	const hiddenFileInput = React.useRef(null);

	const [image, setImage] = useState({ preview: '', data: '' })
	const [status, setStatus] = useState('');
	const handleClick = event => {
		hiddenFileInput.current.click();
	  };
	const handleSubmit = async (e) => {
		var kisipath = window.location.pathname.split('/')[2];

	  e.preventDefault()
	  let formData = new FormData()
	  formData.append('file', image.data)
	  formData.append('kisii','905'+kisipath);
	  const response = await fetch('http://localhost:6000/image', {
		method: 'POST',
		body: formData,
	  })
	  setImage({ preview: '', data: '' });
	  //mongo messagese kaydetme mongo send_messageye kaydetme

  
	  if (response) setStatus(response.statusText)
	  console.log('Resposne',image);
	}
  
	const handleFileChange = (e) => {
		
	  const img = {
		preview: URL.createObjectURL(e.target.files[0]),
		data: e.target.files[0],
	  }
	  setImage(img)
	  console.log('img.data',img.data);
	  setShowAttach(!showAttach)
	}
	return (
		<div className="chat__input-wrapper">
			{showEmojis && (
				<button aria-label="Close emojis" onClick={() => setShowEmojis(false)}>
					<Icon id="cancel" className="chat__input-icon" />
				</button>
			)}
			
			{showEmojis && (
				<>
					<button aria-label="Choose GIF">
						<Icon id="gif" className="chat__input-icon" />
					</button>
					<button aria-label="Choose sticker">
						<Icon id="sticker" className="chat__input-icon" />
					</button>
				</>
			)}
			<div className="pos-rel">
			

				<form onSubmit={handleSubmit}>
			<label for="file-input">
			<Icon
						id="attach"
						className={`chat__input-icon ${
							showAttach ? "chat__input-icon--pressed" : ""
						}`}
					/>
  </label>
				<input accept="image/*" id="file-input" type='file'  style={{display:'none'}}      ref={hiddenFileInput}
 name='file'   onChange={handleFileChange}></input>
				
			  </form>
			  <div
					className={`chat__attach ${showAttach ? "chat__attach--active" : ""}`}
				>
					{image.preview != '' && <button onClick={() =>setImage({ preview: '', data: '' })
}><font style={{color:'red'}}>X</font></button>}
					 {image.preview != '' && <img id="blah" src={image.preview} style={{width:250,height:'auto'}} alt="your image" />}
				</div>
        
				

				
			</div>
			{image.preview != '' && 
			<button aria-label="Emojis" onClick={handleSubmit}>
				<Icon
					
					id="rightArrow"
					className={`chat__input-icon ${
						showEmojis ? "chat__input-icon--highlight" : ""
					}`}
				/>
			</button>}
			<input
				className="chat__input"
				placeholder="Bir mesaj yazın"
				value={newMessage}
				onChange={(e) => setNewMessage(e.target.value)}
				onKeyDown={detectEnterPress}
			/>
			
			{newMessage ? (
				<button aria-label="Send message" onClick={submitNewMessage}>
					<Icon id="send" className="chat__input-icon" />
				</button>
			) : (
				<button aria-label="Record voice note">
					<Icon id="microphone" className="chat__input-icon" />
				</button>
			)}
		</div>
	);
};

export default ChatInput;
