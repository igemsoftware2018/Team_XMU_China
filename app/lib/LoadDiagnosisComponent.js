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

import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';

const scaleAnimation = new ScaleAnimation();

type Props = {};
export default class LoadDianosisComponent extends Component<Props> {
  constructor(props){
  	super(props);
  	this.state = {
          name: '',
          illness: '',
          sex: '',
	  age: '',
	  diagnosis: '',
	  diagnosisAdd: '',
	  password: '',
	  dialogShow: false,
        }
	ws = this.props.ws;
	id = this.props.id;
  }
  
  showScaleAnimationDialog = () => {
    this.scaleAnimationDialog.show();
  }
  
  setPassword(text) {
    this.setState({password: text})
  }

  componentDidMount() {
	this.listener = DeviceEventEmitter.addListener('diagnosisload', (message) => {
		var info = JSON.parse(message);
		this.setState({
		    name: info.name,
		    sex: info.sex,
		    age: info.age,
		    illness: info.illness,
		    diagnosis: info.diagnosis,
		    diagnosisAdd: info.diagnosisaddr
		});
	});
	this.listener = DeviceEventEmitter.addListener('permission', (message) => {
		Alert.alert('Notice:', message);
	});
    }
  componentWillUnmount() {
	if (this.listener) {this.listener.remove();}
  }   

  setDiagnosis(text) {
    this.setState({
	diagnosis : text
    });
  }

  render() {
      return (
        <ScrollView style={styles.container}>
	  <ImageBackground source={require('../image/background4.jpg')} style={styles.backgroundImage}>
	    <View style={styles.center}>
	      <View style={styles.ground1}>
		<Text style={styles.Name}>Name : 
		  <Text style={styles.name}> {this.state.name}</Text>		
		</Text>
		<Text style={styles.age}>Sex  {this.state.sex}      Age  {this.state.age}</Text>
		<Image source={require('../image/stripe.png')} style={styles.stripe}/>
		<TouchableOpacity onPress={ () => {
			this.scaleAnimationDialog.show();
             	      }} 
		>
	           <Image source={require('../image/hospital.png')} style={styles.hospital}/>
	    	</TouchableOpacity>
		<Text style={styles.illnesstitle}>Illness Discription</Text>
		<View style={styles.illness}>
		    <Text style={{marginLeft:5}}>{this.state.illness}</Text>
	        </View>
	      </View>
	      <View style={styles.ground2}>
		<Text style={styles.diagnosistitle}>Diagnosis</Text>
		<TextInput
              	  placeholder="Input Diagnosis"
              	  style={styles.input}
	      	  value={this.state.diagnosis}
              	  onChangeText={(text) => this.setDiagnosis(text)}
              	  autoCapitalize="none"
              	  autoCorrect={false}
	      	  multiline={true}
            	/>
		<View style={styles.row}>
	      	  <TextInput
                    placeholder="Password"
                    style={styles.input2}
                    onChangeText={(text) => this.setPassword(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                  />
	          <Text>        </Text>
	          <TouchableOpacity onPress={() => {
		        var path = fs.DocumentDirectoryPath + '/address';
		              fs.readFile(path,'utf8').then((e)=>{
			    	  var Json = {
					'Id': id,
					'Data': '16',
					'name': 'app',
					'message': e,
					'dadd': this.state.diagnosisAdd,
					'setdiag': this.state.diagnosis,
					'password': this.state.password
				  };
				  ws.send(JSON.stringify(Json));
		 	      });
		    }}
	          >
		    <Image source={require('../image/submit.png')} style={styles.submit}/>
	          </TouchableOpacity>
		</View>
	      </View>
	    </View>  
	  </ImageBackground>
	  <PopupDialog
          	ref={(popupDialog) => {
            	  this.scaleAnimationDialog = popupDialog;
          	}}
          	dialogAnimation={scaleAnimation}
          	dialogTitle={<DialogTitle title="Hospital Information" />}
		width={320}
		height={500}
              >
          	<View>
		  <View style={styles.center}>
		     <View style={styles.hosinfo}>
			<Text style={styles.Name2}>Name : 
		  	  <Text style={styles.name}> {this.state.name}</Text>		
			</Text>
			<Text style={styles.age2}>Sex  {this.state.sex}      Age  {this.state.age}</Text>
			<Image source={require('../image/stripe.png')} style={styles.stripe2}/>
			<Text style={styles.age2}>Department</Text>
			<Text style={styles.age2}>Bed NO.</Text>
			<Text style={styles.age2}>Hospital number</Text>
		     </View>
		     <View style={{flexDirection: 'row'}}>
		       <View>
		     	<Text style={styles.bar}>Bar Code</Text>
		       </View>
			<Text>  </Text>
		       <Image source={require('../image/bar_code.png')} style={styles.barcode} />
		     </View>
		     <View style={{marginTop:50, marginLeft: -47}}>
		     <Text style={styles.bar}>Sample Type</Text>
		     <Text style={styles.bar}>Sample Number</Text>
		     <Text style={styles.bar}>Remarks</Text>
		     <Text style={styles.bar}>Clinical Diagnosis</Text>
		     <Text style={styles.bar}>Data of Inspection</Text>
		     </View>
		  </View>
          	</View>
	      </PopupDialog>
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
    ground1: {
	width: 350,
	height: 320,
	backgroundColor: 'white',
	borderRadius: 15,
	marginTop: 20
    },
    ground2: {
	width: 350,
	height: 280,
	backgroundColor: 'white',
	borderRadius: 15,
	marginTop: 20
    },
    Name: {
	fontSize: 25,
	marginLeft: 30,
	marginTop: 15,
	fontWeight: "300",
    },
    Name2: {
	fontSize: 25,
	marginLeft: 20,
	marginTop: 15,
	fontWeight: "300",
    },
    age: {
	fontSize: 15,
	marginLeft: 30,
	marginTop: 5
    },
    age2: {
	fontSize: 15,
	marginLeft: 20,
	marginTop: 5
    },
    stripe: {
	resizeMode: 'contain',
	width: 300,
	marginLeft: 25
    },
    stripe2: {
	resizeMode: 'contain',
	width: 230,
	marginLeft: 15
    },
    hospital: {
	resizeMode: 'contain',
	height: 80,
	width: 150,
	marginLeft: 30,
	marginTop: -30
    },
    hosinfo:{
	width: 260,
	height: 180,
	borderColor: 'grey',
	borderWidth: 1,
	borderRadius: 10,
	marginTop: 20
    },
    seximage: {
  	width: 30,
	height: 52,
	//marginLeft: 260,
	resizeMode: 'contain',
	marginTop: 30,
	marginLeft: -130
    },
    name: {
	fontSize: 23,
	fontWeight: "200",
	marginTop: 30,
	//color: 'white'
    },
    row: {
	flexDirection: 'row',
	marginLeft: 55
    },
    illnesstitle: {
	fontSize: 20,
	fontWeight: "200",
	//color: '#663399',
	marginLeft: 30,
	marginTop: -30
    }, 
    diagnosistitle: {
	fontSize: 20,
	fontWeight: "200",
	//color: '#663399',
	marginTop: 10,
	marginLeft: 30
    }, 
    illness: {
	width:290,
	height: 170,
	borderColor: 'grey',
	borderRadius: 10,
	marginTop: 5,
	borderWidth: 1,
	marginLeft: 30
    },
    input: {
	width: 290,
	height: 170,
	borderColor: 'grey',
	borderRadius: 10,
	marginTop: 5,
	borderWidth: 1,
	marginLeft: 30	
    },
    input2: {
	textAlign: 'center',
    	height: 40,
    	width: 110,
    	borderColor: 'grey',
    	borderWidth: 1,
    	marginTop: 15,
     	borderRadius: 25,
	fontSize: 15,
	backgroundColor: 'white'
    },
    bar: {
	fontSize: 15,
	marginLeft: -43,
	marginTop: 10,
    },
    barcode: {
	width: 100,
	height: 50,
	marginTop: 5,
	marginLeft: 5,
	resizeMode: 'contain',
    },
    submit: {
	width: 100,
	height: 70,
	//marginTop: 10,
	resizeMode: 'contain',
    }
})
