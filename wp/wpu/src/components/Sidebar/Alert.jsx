import React from "react";
import Icon from "components/Icon";
var path = window.location.pathname.split('/')[1];
var veri;
var veri2;
if(path == 'person'){
	veri = '🤖 Chatbot';
	veri2 = '👥 Müşteri Hizmetleri✔️';
}else{
	veri = '🤖 Chatbot✔️';
	veri2 = '👥 Müşteri Hizmetleri';
}
const alerts = [
	<div className="sidebar__alert sidebar__alert--info">
		
		<div className="sidebar__alert-texts">
			<a href='/chatbot'>
			<p className="sidebar__alert-text">{veri} </p>
			</a>
			<a href="/person">
			<p className="sidebar__alert-text">{veri2} </p>
			</a>
			
		</div>
	</div>
	
];
const randomAlert = alerts.sort(() => 0.5 - Math.random())[0];

const Alert = () => {
	return <>{randomAlert}</>;
};

export default Alert;
