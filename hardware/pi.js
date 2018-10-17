var WebSocket = require('ws');
var async = require('async');
var fs = require('fs');
var ws = new WebSocket('ws://193.112.70.36:3000');
ws.onopen = function(e){
    console.log('Connection to server opened');
    var Json = {
    	'Id':2,
	'Data':'',
	'name':'pi'
    };
    ws.send(JSON.stringify(Json));
}

var connectapp;

var exec = require('child_process').exec;
ws.onmessage = function(evt){
    console.log(evt.data);
    var k = evt.data.slice(0, 7);
    var M = JSON.parse(evt.data);
    connectapp = M.aim;
    var interval;
    if(M.instruction == 'take photo'){
    	exec('sh picture.sh', function(error, stdout, stderr){
	    console.log('success!');
	    if(error){
	    	console.info('stderr : ' + stderr);
	    }
	    exec('java image2string', function(error, stdout, stderr){
                var data = fs.readFileSync('./1.txt', 'utf8');
                console.log(data);
                var Json = {
                        'Id':2,
                        'Data':'6',
                        'name':'pi',
                        'message': data,
                };
                ws.send(JSON.stringify(Json));  
           // console.log(stdout);
           console.log("success!!!");
            });
	});
    }
    else if(M.instruction == 'require speed'){
    	//setInterval(callCPP, 1000);
	callCPP();
    }
    else if(M.instruction == 'turn on'){
    	var speed = M.speed;
    	var time = M.time;
	console.log(speed + " " + time);
	interval = setInterval(() => callCPP(M.aim), 1000);
    	exec('sudo ./speed ' + speed + ' ' + time, function(error, stdout, stderr){
	    console.log("success!");
	    setTimeout(function(){clearInterval(interval)}, 2000);
	    if(error){
	    	console.info("stderr : " + stderr);
	    }
	});
    }
    else if(M.instruction == 'turn off'){
    	exec('sh stop.sh', function(error, stdout, stderr){
	    console.log("success!");
	    setTimeout(function(){clearInterval(interval)}, 2000)
	    if(error){
	    	console.info("stderr : " + stderr);
	    }
	});
    }
    else if(M.instruction == 'auto turn on'){
	interval = setInterval(() => callCPP(M.aim), 1000);
    	exec('sh pi.sh', function(error, stdout, stderr){
	    console.log("audo success!");
	    setTimeout(function(){clearInterval(interval)}, 2000);
	    
	    
	    exec('java image2string', function(error, stdout, stderr){
            	var data = fs.readFileSync('./1.txt', 'utf8');
	    	console.log(data);
            	var Json = {
                	'Id':2,
                	'Data':'6',
                	'name':'pi',
                	'message': data,
            	};
           	ws.send(JSON.stringify(Json));	
           // console.log(stdout);
           console.log("success!!!");
            });
            
	    if(error){
	    	console.info("stderr : " + stderr);
	    }
	});
    }
    else if(M.instruction == 'auto turn off'){
    	exec('sh stopauto.sh', function(error, stdout, stderr){
	    console.log("auto stop success!");
	    setTimeout(function(){clearInterval(interval)}, 2000);
	    if(error){
	    	console.info("stderr : " + stderr);
	    }
	});
    }
    else{/*
    	exec('sudo ./speed ' + evt.data, function(error, stdout, stderr){
	    console.log("success!");
	    if(error){
	    	console.info("stderr : " + stderr);
	    }
	});*/
    }
}

async function callCPP(str){
	await exec('sudo ./LEDtestI2', function(error, stdout, stderr){
			    console.log(stdout);
			    var Json = {
			    	'Id':2,
			 	'Data':4,
				'name':'pi',
				'message':stdout,
				'connectname': str
			    };
			    console.log(Json);
			    ws.send(JSON.stringify(Json));
			    if(error){
				console.info('stderr : ' + stderr);
	    		    }
	});
}

