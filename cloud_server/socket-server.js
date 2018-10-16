var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({port:3000});

var exec = require('child_process').exec;

var AllConnectorsData = new Array();

wss.on('connection', function(ws){
	console.log('client connected');
	ws.on('message', function(message){
	    console.log(message);
	    Temp = JSON.parse(message);
	    if(CheckIsNew(Temp)){
		AllConnectorsData.push({
		    'id':Temp.Id,
		    'ws':ws
		});
                console.log(AllConnectorsData);
	    }/*
	    else{
		for(var i=0; i < AllConnectorsData.length; i++){
		    if(Temp.Id == AllConnectorsData[i]['id']){
			if(Temp.Data != 'connector_register'){
			    AllConnectorsData[i]['ws'].send(Temp.Id + Temp.Data);
			    break;
			}
		    }
		}
	    }*/
	 /*   console.log(message);
            if(message == '1'){*/
            if(Temp.Data == '1'){
	        exec('python py_test.py', function(error, stdout, stderr){
    		    console.log(stdout);
    		    if(error){
			console.info('stderr : ' + stderr);
    		    }
		});
            }
	    if(message == '2'){
		setInterval(callCPP, 3000);
            }          
	});
});

async function callCPP(){
	await exec('./a.out', function(error, stdout, stderr){
	    		    console.log('success!');
			    console.log(stdout);
			    if(error){
				console.info('stderr : ' + stderr);
	    		    }
	});
}

function CheckIsNew(Temp)
{
    for(var i=0; i < AllConnectorsData.length; i++)
        {
            if(Temp.Id == AllConnectorsData[i]['id'])
            {
                return false;
            }
        }
        return true;
}
