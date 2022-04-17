const { exec } = require("child_process");
const axios = require('axios');
setInterval(() => {
  axios.get('http://localhost:6000/alive')
	.then(res => {
	  
      console.log('is alive');
    
    
	}).catch(res => {
	  
    var shell = require('shelljs');

    
    shell.exec('node new_work');
    
	})
},1000);


