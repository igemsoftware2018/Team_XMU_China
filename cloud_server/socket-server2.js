var AllClientsData = new Array();
var fs = require('fs');
var ws = require('nodejs-websocket');
var PORT = 3000;
var level = require('level');
var exec = require('child_process').exec;

var db = level('./mydb');
var dbc = level('./myconstrctdb');

const HttpProvider = "http://193.112.70.36:8100";
var Web3 = require('web3');
if(typeof web3 !== 'undefined'){
    web3 = new Web3(web3.currentProvider);
}
else{
    web3 = new Web3(new Web3.providers.HttpProvider(HttpProvider));
}

var server = ws.createServer(function(conn){
    console.log('New connection');
    conn.on('text', function(str){
	//console.log(str);
        Temp = JSON.parse(str);
	var connectname = Temp.name + Temp.Id;
        //console.log(Temp);
	var response = {};	
        if(CheckIsNew(Temp)){
            AllClientsData.push({
                'id':Temp.Id,
                'name':Temp.name + Temp.Id,
                'conn':conn
            }
            );
            console.log(AllClientsData);
        }
        if(Temp.Data == '-1'){                                            /*test*/
	    console.log(str);
	    exec('python py_test.py', function(error, stdout, stderr){
		console.log(stdout);
		conn.sendText(stdout);
		if(error){
		    console.info('stderr : ' + stderr);
		}
	    });
        }
        else if(Temp.Data == '0'){
            console.log("turn off");
	    var Json = {
		instruction: 'turn off',
		aim: connectname
	    };
	    for(var i=0; i<AllClientsData.length; i++){
		if(AllClientsData[i]['name'] == 'pi2'){
		    AllClientsData[i]['conn'].sendText(JSON.stringify(Json));
		    console.log("turn off");
		    break;
		}
	    }
	}
	else if(Temp.Data == '1'){
	    var set = {
		instruction: 'turn on',
		speed: Temp.speed,
		time: Temp.time,
		aim: connectname,
	    };
	    console.log(set);
	    //var Set = 'turn on' + JSON.stringify(set);
	    console.log("turn on");
	    for(var i=0; i<AllClientsData.length; i++){
		if(AllClientsData[i]['name'] == 'pi2'){
		    AllClientsData[i]['conn'].sendText(JSON.stringify(set));
		    console.log("turn on");
		    break;
		}
	    }
	}
	else if(Temp.Data == '2'){                                       /*require speed*/
	    var Json = {
		instruction: 'require speed',
		aim: connectname,
	    };
	    for(var i=0; i<AllClientsData.length; i++){
		if(AllClientsData[i]['name'] == 'pi2'){
		    AllClientsData[i]['conn'].sendText(JSON.stringify(Json));
		    break;
		}
	    }
	}
	else if(Temp.Data == '3'){
	   console.log("take photo");                                       /*take photo*/
	   var Json = {
		instruction: 'take photo',
		aim: connectname
	   };
	   for(var i=0; i<AllClientsData.length; i++){
		if(AllClientsData[i]['name'] == 'pi2'){
		    AllClientsData[i]['conn'].sendText(JSON.stringify(Json));
   		    break;
		}
	   }
	}
	else if(Temp.Data == '4'){                                       /*return speed*/
	    console.log(Temp.message);
	    for(var i=0; i<AllClientsData.length; i++){
		if(AllClientsData[i]['name'] == Temp.connectname){
		    var Json = {
			'Data': '1',
			'message': Temp.message
		    }
		    AllClientsData[i]['conn'].sendText(JSON.stringify(Json));
		    console.log("send speed success!");
		    break;
		}
	    }
	}
        else if(Temp.Data == '5'){
	    exec('python contour.py' + Temp.message, function(error, stdout, stderr){
		console.log('success!');
		console.log(stdout);
	    });
	}
	else if(Temp.Data == '6'){
	    console.log('hhh');
	  /*  exec('java string2image ' + Temp.message, function(error, stdout, stderr){
		console.log("success!");
	    });*/
	    fs.writeFile('./1.txt', Temp.message, function(err){
		if(err) console.log("ferror!");
		console.log(Temp.message)
		exec('java string2image', function(error, stdout, stderr){
			if(error){
			    console.info("stderr: " + stderr);
			}else{
               		    console.log('success!');
			}
			/*
			 exec('sudo rm 1.txt', function(error, stdout, stderr){
				console.log('rm success!');
			});*/
            	});
	    });/*
	    setTimeout(function(){
		exec('sudo java string2image', function(error, stdout, stderr){
			if(error){
			    console.info("stderr: " + stderr);
			}
			else{
                            console.log('success!');
			}
            	});
	    }, 2000);
	*/
	}
        else if(Temp.Data == '7'){
	    console.log("set speed : " + Temp.message);
            for(var i=0; i<AllClientsData.length; i++){
                if(AllClientsData[i]['name'] == 'pi2'){
                    AllClientsData[i]['conn'].sendText(Temp.message);
                    break;
                }
            }
        }
        else if(Temp.Data == '8'){
     	    console.log(Temp.username);
            console.log(Temp.password);
	    console.log(Temp.identity);     
	    var address = web3.personal.newAccount(Temp.password);
	    var userInfo = {
		'username': Temp.username,
		'address': address,
		'password': Temp.password,
		'identity': Temp.identity
	    };
	    var UserInfo = JSON.stringify(userInfo);
	    db.put(address, UserInfo);
	    db.get(address, function (err, value) {
		var Userinfo = JSON.parse(value);
		console.log(Userinfo);
	    }); 	    	
	    
	    //console.log(address);
	    for(var i=0; i<AllClientsData.length; i++){
                if(AllClientsData[i]['name'] == connectname){
		    var Json = {
			'Data': '2',
			'message': address,
		    };
		    Jsonaddress = JSON.stringify(Json);
                    AllClientsData[i]['conn'].sendText(Jsonaddress);
                    break;
                }
            }    
	}
	else if(Temp.Data == '9'){
	    //console.log(Temp.message);
	    var rest = web3.eth.getBalance(Temp.message);
	    for(var i=0; i<AllClientsData.length; i++){
                if(AllClientsData[i]['name'] == connectname){
		    var Json = {
			'Data': '3',
			'message': rest,
		    };
		    Jsonrest = JSON.stringify(Json);
                    AllClientsData[i]['conn'].sendText(Jsonrest);
                    break;
                }
            }
	}
	else if(Temp.Data == '10'){
	    var coinbase = web3.eth.coinbase;
	    var address = Temp.message;
	    var rest = web3.eth.getBalance(Temp.message);
            if (web3.personal.unlockAccount(coinbase, '111')){
                web3.eth.sendTransaction({from: coinbase, to: Temp.message, value: web3.toWei(1, "Ether")})
                console.log('purchuase success!');
	    }
	    var Interval = setInterval(function(){ 
		var Rest = web3.eth.getBalance(address);
		if(Rest != rest){
			for(var i=0; i<AllClientsData.length; i++){
               		   if(AllClientsData[i]['name'] == connectname){
				var Json = {
                        	    'Data': '4',
                        	    'message': 'purchase success!',
                   	        };
				Jsonpurchase = JSON.stringify(Json);
                    		AllClientsData[i]['conn'].sendText(Jsonpurchase);
                    		break;
                	   }
            		}  
			clearInterval(Interval);
		}
	    }, 1000);            
	}
	else if(Temp.Data == '11'){
	    web3.personal.unlockAccount(Temp.address, Temp.password);
	    var _name = Temp.username ;
	    var _sex = Temp.sex;
	    var _illness = Temp.illness;
	    var _age = Temp.age;
	    console.log(_name)
	    console.log(_sex)
	    console.log(_illness)
	    console.log(_age)
	    var DiagnosisContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"PatientCancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_diagnosis","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"DoctorIdentify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"say","outputs":[{"name":"name","type":"string"},{"name":"sex","type":"string"},{"name":"age","type":"string"},{"name":"illness","type":"string"},{"name":"diagnosis","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Patient","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Doctor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"PatientAccomplish","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_sex","type":"string"},{"name":"_age","type":"string"},{"name":"_illness","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"patientcancel","type":"event"},{"anonymous":false,"inputs":[],"name":"doctoridentify","type":"event"},{"anonymous":false,"inputs":[],"name":"patientaccomplish","type":"event"}]);
	    var Diagnosis = DiagnosisContract.new(
   		_name,_sex,_age,_illness,
  		 {
     			from: Temp.address, 
			data: '0x608060405260a060405190810160405280602060405190810160405280600081525081526020016020604051908101604052806000815250815260200160206040519081016040528060008152508152602001602060405190810160405280600081525081526020016020604051908101604052806000815250815250600260008201518160000190805190602001906200009c92919062000249565b506020820151816001019080519060200190620000bb92919062000249565b506040820151816002019080519060200190620000da92919062000249565b506060820151816003019080519060200190620000f992919062000249565b5060808201518160040190805190602001906200011892919062000249565b5050503480156200012857600080fd5b506040516200123c3803806200123c83398101806040528101908080518201929190602001805182019291906020018051820192919060200180518201929190505050836002600001908051906020019062000186929190620002d0565b508260026001019080519060200190620001a2929190620002d0565b5081600280019080519060200190620001bd929190620002d0565b508060026003019080519060200190620001d9929190620002d0565b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600160146101000a81548160ff021916908360038111156200023a57fe5b0217905550505050506200037f565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200028c57805160ff1916838001178555620002bd565b82800160010185558215620002bd579182015b82811115620002bc5782518255916020019190600101906200029f565b5b509050620002cc919062000357565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200031357805160ff191683800117855562000344565b8280016001018555821562000344579182015b828111156200034357825182559160200191906001019062000326565b5b50905062000353919062000357565b5090565b6200037c91905b80821115620003785760008160009055506001016200035e565b5090565b90565b610ead806200038f6000396000f30060806040526004361061008e576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633896cc99146100935780633d7403a3146100aa578063707be2d014610113578063954ab4b21461012a578063ac40c9a81461036a578063ad0ad050146103c1578063c19d93fb14610418578063e406060614610451575b600080fd5b34801561009f57600080fd5b506100a8610468565b005b3480156100b657600080fd5b50610111600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061061d565b005b34801561011f57600080fd5b5061012861075b565b005b34801561013657600080fd5b5061013f61088c565b60405180806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b8381101561018f578082015181840152602081019050610174565b50505050905090810190601f1680156101bc5780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b838110156101f55780820151818401526020810190506101da565b50505050905090810190601f1680156102225780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b8381101561025b578082015181840152602081019050610240565b50505050905090810190601f1680156102885780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b838110156102c15780820151818401526020810190506102a6565b50505050905090810190601f1680156102ee5780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b8381101561032757808201518184015260208101905061030c565b50505050905090810190601f1680156103545780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390f35b34801561037657600080fd5b5061037f610bc9565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103cd57600080fd5b506103d6610bee565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561042457600080fd5b5061042d610c14565b6040518082600381111561043d57fe5b60ff16815260200191505060405180910390f35b34801561045d57600080fd5b50610466610c27565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561052c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f4f6e6c792070617469656e742063616e2063616c6c20746869732e000000000081525060200191505060405180910390fd5b600080600381111561053a57fe5b600160149054906101000a900460ff16600381111561055557fe5b1415156105ca576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f496e76616c69642073746174652e00000000000000000000000000000000000081525060200191505060405180910390fd5b6003600160146101000a81548160ff021916908360038111156105e957fe5b02179055507f6be000c08b61a63a8b1ee8ca86756609f0e18c89ffcf99f9ef2d9ca8dd94e5a360405160405180910390a150565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106e2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f4f6e6c7920646f63746f722063616e2063616c6c20746869732e00000000000081525060200191505060405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561073e57600080fd5b8060026004019080519060200190610757929190610ddc565b5050565b600080600381111561076957fe5b600160149054906101000a900460ff16600381111561078457fe5b1415156107f9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f496e76616c69642073746174652e00000000000000000000000000000000000081525060200191505060405180910390fd5b60018060146101000a81548160ff0219169083600381111561081757fe5b021790555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f2296621df28c030ae6b18be6517ebd20ffc36e28ce320cfdbb0c0ae398880dd960405160405180910390a150565b6060806060806060600260000160026001016002800160026003016002600401848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109415780601f1061091657610100808354040283529160200191610941565b820191906000526020600020905b81548152906001019060200180831161092457829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109dd5780601f106109b2576101008083540402835291602001916109dd565b820191906000526020600020905b8154815290600101906020018083116109c057829003601f168201915b50505050509350828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a795780601f10610a4e57610100808354040283529160200191610a79565b820191906000526020600020905b815481529060010190602001808311610a5c57829003601f168201915b50505050509250818054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b155780601f10610aea57610100808354040283529160200191610b15565b820191906000526020600020905b815481529060010190602001808311610af857829003601f168201915b50505050509150808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bb15780601f10610b8657610100808354040283529160200191610bb1565b820191906000526020600020905b815481529060010190602001808311610b9457829003601f168201915b50505050509050945094509450945094509091929394565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160149054906101000a900460ff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610ceb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f4f6e6c792070617469656e742063616e2063616c6c20746869732e000000000081525060200191505060405180910390fd5b6001806003811115610cf957fe5b600160149054906101000a900460ff166003811115610d1457fe5b141515610d89576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f496e76616c69642073746174652e00000000000000000000000000000000000081525060200191505060405180910390fd5b6002600160146101000a81548160ff02191690836003811115610da857fe5b02179055507f31aecf94951dd430f0df4551c30c4f0cf1e90f0498e3398cfe89786a5a59c6f960405160405180910390a150565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610e1d57805160ff1916838001178555610e4b565b82800160010185558215610e4b579182015b82811115610e4a578251825591602001919060010190610e2f565b5b509050610e589190610e5c565b5090565b610e7e91905b80821115610e7a576000816000905550600101610e62565b5090565b905600a165627a7a72305820b43fcd8fa8076a98e4995e7c4a869fb88447cf01b1c03b248731f640ad3bd0c50029',
			gas: '470000000'
   		}, function (e, contract){
    	    		console.log(e, contract);
    	    		if (typeof contract.address !== 'undefined') {
           	 	    console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
			    var Json = {
				'Data': '5',
				'message': contract.address,
			    }
			    Jsoncontractaddress = JSON.stringify(Json);
			    var patientname;
			    db.get(Temp.address, function (err, value) {
				var u = JSON.parse(value);
				patientname = u.username;
				var diagnosisinfo = {
                                    'DiagnosisAddress': contract.address,
                                    'PatientAddress': Temp.address,
                                    'PatientName': patientname,
                                };
                                dbc.put(contract.address, JSON.stringify(diagnosisinfo));
                                dbc.get(contract.address, function (err, value) {
                                   var Contractinfo = JSON.parse(value);
                                   console.log(Contractinfo);
                                });
			    });
			/*
			    var diagnosisinfo = {
				'DiagnosisAddress': contract.address,
				'PatientAddress': Temp.address,
				'PatientName': 'hhh',
			    };
			    dbc.put(contract.address, JSON.stringify(diagnosisinfo));
                            dbc.get(contract.address, function (err, value) {
               			 var Contractinfo = JSON.parse(value);
                		console.log(Contractinfo);
            		    });
			*/
			    for(var i=0; i<AllClientsData.length; i++){
                          	if(AllClientsData[i]['name'] == connectname){
                                    AllClientsData[i]['conn'].sendText(Jsoncontractaddress);
                                    break;
                           	}
                            }
   	    		}
	     });
	}
	else if(Temp.Data == '12'){
            console.log("auto turn off");
	    var Json = {
		instruction: 'auto turn off',
		aim: connectname
	    };
            for(var i=0; i<AllClientsData.length; i++){
                if(AllClientsData[i]['name'] == 'pi2'){
                    AllClientsData[i]['conn'].sendText(JSON.stringify(Json));
                    console.log("auto turn off");
                    break;
                }
            }
        }
        else if(Temp.Data == '13'){
            console.log("auto turn on");
	    var Json = {
		instruction: 'auto turn on',
		aim: connectname
	    };
            for(var i=0; i<AllClientsData.length; i++){
                if(AllClientsData[i]['name'] == 'pi2'){
                    AllClientsData[i]['conn'].sendText(JSON.stringify(Json));
                    console.log("auto turn on");
                    break;
                }
            }
        }
	else if(Temp.Data == '14'){
	    dbc.createReadStream()
		.on('data', function(data){
		   response[data.key.toString()] = data.value.toString(); 
		})
		.on('error', function(err){
		   console.log('error: ', err)
		})
		.on('close', function(){
		   console.log('Stream closed!')
		})
		.on('end', function(){
		  console.log(response)
		  console.log(Object.keys(response).length)
		  var rsp = JSON.stringify(response)
		  console.log(rsp)
		  for(var i=0; i<AllClientsData.length; i++){
                    if(AllClientsData[i]['name'] == connectname){
                         AllClientsData[i]['conn'].sendText(rsp);
                         break;
                    }
                 }	
		})
	}
	else if(Temp.Data == '15'){
	    var abi = [{"constant":false,"inputs":[],"name":"PatientCancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_diagnosis","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"DoctorIdentify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"say","outputs":[{"name":"name","type":"string"},{"name":"sex","type":"string"},{"name":"age","type":"string"},{"name":"illness","type":"string"},{"name":"diagnosis","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Patient","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Doctor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"PatientAccomplish","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_sex","type":"string"},{"name":"_age","type":"string"},{"name":"_illness","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"patientcancel","type":"event"},{"anonymous":false,"inputs":[],"name":"doctoridentify","type":"event"},{"anonymous":false,"inputs":[],"name":"patientaccomplish","type":"event"}]; 
	    var callcontract = web3.eth.contract(abi).at(Temp.message); 
	    console.log(Temp.message);
	    console.log(callcontract.say());
	    var Json = {
		'Data': "6",
		'name': callcontract.say()[0],
		'sex': callcontract.say()[1],
		'age': callcontract.say()[2],
		'illness': callcontract.say()[3],
		'diagnosis': callcontract.say()[4],
		'diagnosisaddr': Temp.message	
	    };
	    for(var i=0; i<AllClientsData.length; i++){
                    if(AllClientsData[i]['name'] == connectname){
                         AllClientsData[i]['conn'].sendText(JSON.stringify(Json));
                         break;
                    }
            } 
	}
	else if(Temp.Data == '16'){
	    console.log(Temp);
	    db.get(Temp.message, function (err, value) {
                var u = JSON.parse(value);
                if(u.identity == 'doctor'){
		    web3.personal.unlockAccount(Temp.message, Temp.password);
		    var abi = [{"constant":false,"inputs":[],"name":"PatientCancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_diagnosis","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"DoctorIdentify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"say","outputs":[{"name":"name","type":"string"},{"name":"sex","type":"string"},{"name":"age","type":"string"},{"name":"illness","type":"string"},{"name":"diagnosis","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Patient","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Doctor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"PatientAccomplish","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_sex","type":"string"},{"name":"_age","type":"string"},{"name":"_illness","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"patientcancel","type":"event"},{"anonymous":false,"inputs":[],"name":"doctoridentify","type":"event"},{"anonymous":false,"inputs":[],"name":"patientaccomplish","type":"event"}];
		    console.log(Temp.dadd)
            	    var contract = web3.eth.contract(abi).at(Temp.dadd);
		    contract.DoctorIdentify({from: Temp.message});
            	    contract.update(Temp.setdiag,{from: Temp.message});
            	    console.log(contract.say());
		}
		else{
		    var Json = {
			'Data': '7',
			message: 'Permissions Limited!'
		    };
		    for(var i=0; i<AllClientsData.length; i++){
                        if(AllClientsData[i]['name'] == connectname){
                             AllClientsData[i]['conn'].sendText(JSON.stringify(Json));
                             break;
                        }
                    }	    
		}
            });
/*
	    web3.personal.unlockAccount(Temp.message, Temp.password);
	    var abi = [{"constant":false,"inputs":[],"name":"PatientCancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_diagnosis","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"DoctorIdentify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"say","outputs":[{"name":"name","type":"string"},{"name":"sex","type":"string"},{"name":"illness","type":"string"},{"name":"diagnosis","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Patient","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Doctor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"PatientAccomplish","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_sex","type":"string"},{"name":"_illness","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"patientcancel","type":"event"},{"anonymous":false,"inputs":[],"name":"doctoridentify","type":"event"},{"anonymous":false,"inputs":[],"name":"patientaccomplish","type":"event"}];
	    console.log(Temp.dadd)
	    var contract = web3.eth.contract(abi).at(Temp.dadd);
	    contract.update(Temp.setdiag,{from: Temp.message});
	    console.log(contract.say());*/
	}
	else if(Temp.Data == '17'){
            dbc.createReadStream()
                .on('data', function(data){
                   response[data.key.toString()] = data.value.toString();
                })
                .on('error', function(err){
                   console.log('error: ', err)
                })
                .on('close', function(){
                   console.log('Stream closed!')
                })
                .on('end', function(){
		  response.Data = '8'
                  console.log(response)
                  console.log(Object.keys(response).length)
                  var rsp = JSON.stringify(response)
                  console.log(rsp)
                  for(var i=0; i<AllClientsData.length; i++){
                    if(AllClientsData[i]['name'] == connectname){
                         AllClientsData[i]['conn'].sendText(rsp);
                         break;
                    }
                 }
                })
        }
	else if(Temp.Data == '18'){
	    exec('sudo java ImageResizer', function(error, stdout, stderr){
		if(error){
		    console.info("stderr: " + stderr);
		}
		else{
		    exec('sudo python3 cnn.py', function(error, stdout, stderr){
			if(error){
			    console.info('stderr: ' + stderr);
			}
			else{
			    console.log(stdout);
			    var a=stdout;
			    if(a[0] == '1'){
				var Json = {
				    'Data': 9,
				    'url': 'http://193.112.70.36:8080/pictures/illness0.png'
				};
				for(var i=0; i<AllClientsData.length; i++){
                   		     if(AllClientsData[i]['name'] == connectname){
                         		AllClientsData[i]['conn'].sendText(JSON.stringify(Json));
                         		break;
                    		     }
                 		}			
			    }
			    else if(a[0] == '2'){
				var Json = {
                                    'Data': 9,
                                    'url': 'http://193.112.70.36:8080/pictures/illness1.png'
                                };
                                for(var i=0; i<AllClientsData.length; i++){
                                     if(AllClientsData[i]['name'] == connectname){
                                        AllClientsData[i]['conn'].sendText(JSON.stringify(Json));
                                        break;
                                     }
                                }
			    }
			}
		    });
		}		
	    });
	}
    });
}).listen(PORT);

function CheckIsNew(Temp)
{
    for(var i=0; i<AllClientsData.length; i++)
        {
            if(Temp.Id == AllClientsData[i]['id'])
            {
                return false;
            }
        }
        return true;
}
