import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Button,
  Alert,
  Text,
  TextInput,
  DeviceEventEmitter,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity
} from 'react-native';

const fs = require("react-native-fs");

export default class CreateWallet extends Component {
  constructor(props){
    super(props);
    this.state = {
	username: '',
        password: '',
	password_again: '',
	identity: '',
        loading: false,
	identityStatus: 'doctor'
    }
    ws = this.props.ws;
    id = this.props.id;
  }

  setUsername(text){
    this.setState({username: text})
  }   

  setPassword(text) {
    this.setState({password: text})
  }
  
  setPasswordAgain(text) {
    this.setState({password_again: text})
  }

  setIdentity(text) {
    this.setState({identity: text})
  }

  onButtonPress = () => {
      if(this.state.password == this.state.password_again){
	  var Json = {
    	   	     'Id': id,
	   	     'Data': '8',
	   	     'name': 'app',
		     'password': this.state.password,
		     'username': this.state.username,
		     'identity': this.state.identityStatus,
    		  };
    	  ws.send(JSON.stringify(Json));
       }
       else
	  Alert.alert('Notice:', 'password wrong! please input again!');	
  }

  onPressIdentity = () => {
	this.setState({
  	    identityStatus: 'doctor'      
  	});
  }

  onPressIdentity2 = () => {
	this.setState({
  	    identityStatus: 'patient'      
  	});
  }

  componentDidMount() {
	this.listener = DeviceEventEmitter.addListener('address', (message) => {
		Alert.alert('Notice:', 'Your address is : ' + message);
		var path = fs.DocumentDirectoryPath + '/address';		
		fs.writeFile(path, message, 'utf8');
		//fs.readFile(path,'utf8').then((e)=>{alert(e)});

	});
    }
  componentWillUnmount() {
	if (this.listener) {this.listener.remove();}
  }  

  render() {
    return (
      <ScrollView style={styles.container}>
	<ImageBackground source={require('../image/background4.jpg')} style={styles.backgroundImage}>
	  <View style={styles.center}>
	    <Text style={styles.create_account_text}>Create your account</Text>
	    <TextInput
              placeholder="Username"
              style={styles.input}
              onChangeText={(text) => this.setUsername(text)}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={false}
            />
	    <TextInput
              placeholder="Password"
              style={styles.input}
              onChangeText={(text) => this.setPassword(text)}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
            />
	    <TextInput
              placeholder="Password Again"
              style={styles.input}
              onChangeText={(text) => this.setPasswordAgain(text)}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
            />
	    <View style={styles.row}>
	      <Text style={styles.identity}>Identity       </Text>
	      <TouchableOpacity
	     	activeOpacity = {1}
             	onPress={this.onPressIdentity}
       	     	style={styles.touchableOpacity}
	      >
	        <Image source={(this.state.identityStatus == 'doctor')?(require('../image/doctor_on.png')):(require('../image/doctor_off.png'))} style = {styles.identityimage}>
                </Image>
	      </TouchableOpacity>
	      <Text>     </Text>
	      <TouchableOpacity
	     	activeOpacity = {1}
             	onPress={this.onPressIdentity2}
       	     	style={styles.touchableOpacity}
	      >
	        <Image source={(this.state.identityStatus == 'patient')?(require('../image/patient_on.png')):(require('../image/patient_off.png'))} style = {styles.identityimage}>
                </Image>
	      </TouchableOpacity>
	    </View>
	    <TouchableOpacity onPress={this.onButtonPress}>
              <View style={styles.narrowbackground}>
	        <Image source={require('../image/create.png')} style={styles.create}></Image>
	      </View>
            </TouchableOpacity>
	  </View>
	</ImageBackground>
      </ScrollView>
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
        height: 656,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    center:{
	flex: 1,
	alignItems: 'center',
    },
    create_account_text: {
	fontSize: 30,
	color: 'white',
	fontWeight: "600",
	marginTop: 120,
	marginBottom: 10
    },
    input: {
	textAlign: 'center',
    	height: 40,
    	width: 200,
    	borderColor: 'grey',
    	borderWidth: 2,
    	margin: 10,
     	borderRadius: 25,
	fontSize: 15,
	backgroundColor: 'white'
    },
    row: {
	flexDirection: 'row',
    },
    identity: {
	fontSize: 22,
	fontWeight: "500",
	color: 'white',
	marginTop: 20
    },
    identityimage: {
  	width: 30,
	height: 52,
	//marginLeft: 260,
	resizeMode: 'contain',
	marginTop: 5
    },
    narrowbackground:{
        width: 120,
	height: 40,
	backgroundColor: 'white',
	borderRadius: 25,
	marginTop: 20,
	alignItems: 'center',
	justifyContent: 'center',
    },
    create: {
	width: 80,
	height: 42,
	//marginLeft: 260,
	resizeMode: 'contain',
    },
    Password: {
    	textAlign: 'center',
    	height: 40,
    	width: 200,
    	borderColor: 'red',
    	borderWidth: 2,
    	margin: 3
    },
});
