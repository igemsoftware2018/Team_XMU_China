const deploySmartContract = require('./src/deploySmartContract');

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  DeviceEventEmitter,
  Image
} from 'react-native';
const fs = require("react-native-fs");
type Props = {};
export default class DeploySmartContractConponent extends Component<Props> {
  constructor(props){
  	super(props);
  	this.state = {
          password: '',
          name: '',
          illness: '',
          sex: 'male',
	  age: ''
      }
	id = this.props.id;
  }

  componentDidMount() {
	this.listener = DeviceEventEmitter.addListener('contract', (message) => {
		Alert.alert('Notice:', 'Your diagnosis address : ' + message);
	});
    }
  componentWillUnmount() {
	if (this.listener) {this.listener.remove();}
  }   

  setPassword(text) {
    this.state.password = text;
  }

  setName(text) {
    this.state.name = text;
  }

  setIllness(text) {
    this.state.illness = text;
  }

  setAge(text) {
    this.state.age = text;
  }

  onPressSex = () => {
	this.setState({
  	    sex: 'male'      
  	});
  }

  onPressSex2 = () => {
	this.setState({
  	    sex: 'female'      
  	});
  }

  render() {
      return (
        <ScrollView style={styles.container}>
	<ImageBackground source={require('../image/background4.jpg')} style={styles.backgroundImage}>
	  <View style={styles.center}>
	    <Text style={styles.deploy_text}>Deploy Illness</Text>
	    <TextInput
              placeholder="Name"
              style={styles.input}
              onChangeText={(text) => this.setName(text)}
              autoCorrect={false}
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
              placeholder="Age"
              style={styles.input}
              onChangeText={(text) => this.setAge(text)}
              autoCorrect={false}
            />
	    <View style={styles.row}>
	      <Text style={styles.sex}>Sex       </Text>
	      <TouchableOpacity
	     	activeOpacity = {1}
             	onPress={this.onPressSex}
       	     	style={styles.touchableOpacity}
	      >
	        <Image source={(this.state.sex == 'male')?(require('../image/male_on.png')):(require('../image/male_off.png'))} style = {styles.seximage}>
                </Image>
	      </TouchableOpacity>
	      <Text>     </Text>
	      <TouchableOpacity
	     	activeOpacity = {1}
             	onPress={this.onPressSex2}
       	     	style={styles.touchableOpacity}
	      >
	        <Image source={(this.state.sex == 'female')?(require('../image/female_on.png')):(require('../image/female_off.png'))} style = {styles.seximage}>
                </Image>
	      </TouchableOpacity>
	    </View>
	    <TextInput
              placeholder="Illness"
              style={styles.illness}
              onChangeText={(text) => this.setIllness(text)}
              autoCorrect={false}
	      multiline={true}
            />
            <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
              <View style={styles.narrowbackground}>
	        <Image source={require('../image/deploy.png')} style={styles.deploy}></Image>
	      </View>
            </TouchableOpacity>
	  </View>  
	</ImageBackground>
      </ScrollView>
      );
  }

  onButtonPress() {
     var path = fs.DocumentDirectoryPath + '/address';
     fs.readFile(path,'utf8').then((e)=>{
		var Json = {
			'Id': id,
			'Data': '11',
			'name': 'app',
			'username': this.state.name,
			'sex': this.state.sex,
			'illness': this.state.illness,
			'password': this.state.password,
			'age': this.state.age, 
			'address': e
		}
		ws.send(JSON.stringify(Json));
     });
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
    deploy_text: {
	fontSize: 30,
	color: 'white',
	fontWeight: "600",
	marginTop: 40,
	marginBottom: 10
    },
    input: {
	textAlign: 'center',
    	height: 40,
    	width: 250,
    	borderColor: 'grey',
    	borderWidth: 2,
    	margin: 10,
     	borderRadius: 25,
	fontSize: 15,
	backgroundColor: 'white'
    },
    sex: {
	fontSize: 25,
	fontWeight: "500",
	color: 'white',
	marginTop: 20
    },
    seximage: {
  	width: 30,
	height: 52,
	//marginLeft: 260,
	resizeMode: 'contain',
	marginTop: 10
    },
    row: {
	flexDirection: 'row',
    },
    illness: {
	textAlign: 'center',
    	height: 200,
    	width: 250,
    	borderColor: 'grey',
    	borderWidth: 2,
    	margin: 10,
     	borderRadius: 25,
	fontSize: 15,
	backgroundColor: 'white'
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
    deploy: {
	width: 80,
	height: 42,
	//marginLeft: 260,
	resizeMode: 'contain',
    },
})
