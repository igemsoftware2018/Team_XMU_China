import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button,
    TextInput,
    DeviceEventEmitter,
    ScrollView,
    ImageBackground,
    Image,
    Alert
} from 'react-native';


const fs = require("react-native-fs");
import {StackNavigator} from 'react-navigation';

import ActionButton from 'react-native-action-button';
import {Icon} from 'react-native-elements';

import CreateWallet from './lib/CreateWalletComponent';
import DeploySmartContract from './lib/DeploySmartContractComponent';
import LoadDiagnosis from './lib/LoadDiagnosisComponent';

var DiagnosisList;

type Props = {};
class ManagementList extends Component<Props> {
  constructor(props){
    super(props);
    this.buttons = [];
  }
 
  A(){
     var Load = {
	'Id': id,
	'Data': '14',
	'name': 'app',
     };
     ws.send(JSON.stringify(Load));
  }

  B(){
     var Load = {
	'Id': id,
	'Data': '17',
	'name': 'app',
     };
     ws.send(JSON.stringify(Load));
  }
	
  Refresh() {
    this.buttons = [];
    this.A();
  }  
 
  Refresh2() {
     this.buttons = [];
     this.B();
  }

  componentDidMount() {
	this.listener = DeviceEventEmitter.addListener('rest', (message) => {
		Alert.alert('Notice:', message);
	});
	this.listener = DeviceEventEmitter.addListener('purchase', (message) => {
		Alert.alert('Notice:', message);
	});
	this.listener = DeviceEventEmitter.addListener('diagnosis', (message) => {
		var contract = JSON.parse(message);
		var num = Object.keys(contract).length;
		for (var key in contract) {
	    	  this.buttons.push([JSON.parse(contract[key]).PatientName, JSON.parse(contract[key]).DiagnosisAddress])
		}
		this.forceUpdate()
	});
	this.listener = DeviceEventEmitter.addListener('diagnosisown', (message) => {
		var contract = JSON.parse(message);
		var num = Object.keys(contract).length;
		var path = fs.DocumentDirectoryPath + '/address';
		fs.readFile(path,'utf8').then((e)=>{
		  for (var key in contract) {	  
		    if(JSON.parse(contract[key]).PatientAddress == e){	
		      this.buttons.push([JSON.parse(contract[key]).PatientName, JSON.parse(contract[key]).DiagnosisAddress])
		    }
		  }
		  this.forceUpdate()
     		});
	});
    }
  componentWillUnmount() {
	if (this.listener) {this.listener.remove();}
  }  
  
  static navigationOptions = {
    title: 'Diagnosis',
    header: null
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        <ImageBackground source={require('./image/background3.png')} style={styles.backgroundImage}>
	  <View style={styles.center}>	  
	    <Text style={styles.diagnosis}>Diagnosis</Text>
	    <ScrollView>
	      {/*pages*/}
	      {
		 this.buttons.map((elem, index) => {
		  return(
		    <View key={index} style={styles.item}>
	    	      <TouchableOpacity onPress={ () => {
			var Json = {
		    	  'Id': id,
		     	  'Data': '15',
		    	  'name': 'app',
		    	  'message': elem[1]
      			};
      			ws.send(JSON.stringify(Json));
			navigate('LoadDiagnosis');
			
             	      }}>
	                <Text style={styles.patient}>{elem[0]}</Text>
	    	      </TouchableOpacity>
	    	      <Image source={require('./image/stripe.png')} style={styles.stripe}/>
	    	    </View>
		  );
                 })}
	    </ScrollView>
   	    <View style={{flexDirection: 'row'}}>
              <Button
                title='All'
                onPress={this.Refresh.bind(this)}
              >
              </Button>
	      <Text>     </Text>
	      <Button
                title='Mine'
                onPress={this.Refresh2.bind(this)}
              >
              </Button>
            </View>
	  </View>
	  <ActionButton buttonColor="#5586ff" position='left' verticalOrientation='up'>
            <ActionButton.Item buttonColor='#9b59b6' title="Create Wallet" onPress={() => navigate('CreateWallet')}>
              <Icon name="font-download" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="Buy money" onPress={() => {
			  var path = fs.DocumentDirectoryPath + '/address';
		          fs.readFile(path,'utf8').then((e)=>{
				  var Json = {
					'Id': id,
					'Data': '10',
					'name': 'app',
					'message': e
				  };
				  ws.send(JSON.stringify(Json));
		 	  });
		  }}>
              <Icon name="font-download" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item title="Check money" buttonColor='#1abc9c' onPress={() => {
			  var path = fs.DocumentDirectoryPath + '/address';
		          fs.readFile(path,'utf8').then((e)=>{
				  var Json = {
				 	'Id': id,
					'Data': '9',
					'name': 'app',
					'message': e
				  };
				  ws.send(JSON.stringify(Json));
		  	  });
		  }}>
              <Icon name="font-download" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
	  <ActionButton
            buttonColor="#5586ff"
            onPress={() => navigate('DeploySmartContract')}
            renderIcon={() => (
            	<Text style={styles.deploy}>Deploy</Text>
            )}
        />
	</ImageBackground>
      </ScrollView>
    );
  }
}

const Wallet = StackNavigator({
    main: {screen: ManagementList},
    CreateWallet: {
	screen: () => (<CreateWallet ws={ws} id={id}/>),
   	navigationOptions: {
    	    title: 'Create Account',
	    headerStyle: {
		backgroundColor: '#5586ff',
	    }
  	}
    },
    DeploySmartContract: {
	screen: () => (<DeploySmartContract ws={ws} id={id}/>),
	navigationOptions: {
	    title: 'Deploy Illness',
	    headerStyle: {
		backgroundColor: '#5586ff',
	    }
	}
    },
    LoadDiagnosis: {
	screen: () => (<LoadDiagnosis ws={ws} id={id}/>),
	navigationOptions: {
	    title: 'Details',
	    headerStyle: {
		backgroundColor: '#5586ff',
	    }
	}
    }
  });

export default class Diagnosis extends Component {
    constructor(props){
	super(props);
	ws = this.props.ws;
	id = this.props.id;
    }
    render() {
        return (
            <Wallet />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
	height: null
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: 712,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    deploy: {
	fontSize: 15,
	fontWeight: "600",
	color: 'white'
    },
    diagnosis: {
	fontSize: 30,
	color: '#663399',
	fontWeight: "600",
	marginTop: 70,
	marginBottom: 10
    },/*
    button: {
        width: 120,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#4398ff',
	marginTop: 10
    },*/
    patient: {
	fontSize: 25,
	fontWeight: "400"
    },
    center: {
	justifyContent:'center',
	alignItems:'center',
    },
    item: {
	justifyContent:'center',
	alignItems:'center',
	width: 300
    },
    stripe: {
	resizeMode: 'contain',
	width: 320,
	marginLeft: 15
    },
});
