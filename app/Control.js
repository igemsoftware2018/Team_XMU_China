import React, {Component} from 'react';
import {
    AppRegistry,
    Platform,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Button,
    Image,
    Alert,
    ScrollView,
    ImageBackground,
    Dimensions,
} from 'react-native';

import { Slider } from 'react-native-elements';

import { DeviceEventEmitter } from 'react-native';

var machineStatus;

class Switch extends Component {
    constructor(props){
	super(props);
	this.state={
	    pressStatus: 1,
	    speed: '',
	    time: ''
	};
    }
    onPress = () => {
	this.setState({
	    pressStatus: this.state.pressStatus * (-1)
 	});
	machineStatus = this.state.pressStatus;
	if(this.state.pressStatus == -1){
	    var Json = {
		'Id': id,
                'Data': 0,
		'name': 'app'
	    };
	    this.props.ws.send(JSON.stringify(Json));
	}
	else{
	    var Json = {
		'Id': id,
                'Data': 1,
		'name': 'app',
		'speed': this.state.speed,
		'time': this.state.time,
	    };
	    this.props.ws.send(JSON.stringify(Json));
	}
    }
   
    componentDidMount() {
	this.listener = DeviceEventEmitter.addListener('set', (message) => {
		var set = JSON.parse(message);	        
		this.setState({
			speed: set.speed,
			time: set.time
		});
	});
    }
    componentWillUnmount() {
	if (this.listener) {this.listener.remove();}
    }  

    render() {
	return(
	  <TouchableOpacity
	     activeOpacity = {1}
             onPress={this.onPress}
       	     style={styles.touchableOpacity}
	  >
	  <Image source={(this.state.pressStatus == 1)?(require('./image/switch_on.png')):(require('./image/switch_off.png'))} style = {styles.switchButton}>
          </Image>
	  </TouchableOpacity>
       );
    }
}

class AutoSwitch extends Component {
    constructor(props){
	super(props);
	this.state={
	    pressStatus: 1
	};
    }
    onPress = () => {
	this.setState({
	    pressStatus: this.state.pressStatus * (-1)
 	});
	machineStatus = this.state.pressStatus;
	if(this.state.pressStatus == -1){
	    var Json = {
		'Id': id,
                'Data': 12,
		'name': 'app'
	    };
	    this.props.ws.send(JSON.stringify(Json));
	}
	else{
	    var Json = {
		'Id': id,
                'Data': 13,
		'name': 'app'
	    };
	    this.props.ws.send(JSON.stringify(Json));
	}
    }
    render() {
	return(
	  <TouchableOpacity
	     activeOpacity = {1}
             onPress={this.onPress}
       	     style={styles.touchableOpacity}
	  >
	  <Image source={(this.state.pressStatus == 1)?(require('./image/autoswitch_on.png')):(require('./image/autoswitch_off.png'))} style = {styles.autoswitchButton}>
          </Image>
	  </TouchableOpacity>
       );
    }
}

type Props = {};
export default class Control extends Component<Props> {
    constructor(props){
	super(props);
	this.state = {
	    InputText: "0",
	    value: 0,
	    speed: "0",
	    time: 0,
	};
	ws = this.props.ws;
	id = this.props.id;
    }
    componentDidMount() {
	this.listener = DeviceEventEmitter.addListener('speed', (message) => {this.setState({speed:message})});
    }
    componentWillUnmount() {
	if (this.listener) {this.listener.remove();}
    }
    onButtonPress = (props) => {  /*take photo*/
    	var Json = {
    	   'Id':id,
	   'Data':'3',
	   'name':'app'
    	};
    	this.props.ws.send(JSON.stringify(Json));
    }
    render() {
    return (
      <ScrollView style={styles.container}>
        <ImageBackground source={require('./image/background.png')} style={styles.backgroundImage}>
	  <View style={styles.center}>
	    <Text style={styles.XMU_CHINA_text}>XMU-China</Text>
	    <ImageBackground source={require('./image/circle.png')} style={styles.circle}>
              <Text style={styles.Speed_text}>Speed</Text>
              <Text style={styles.speed_text}>{this.state.speed}
		<Text style={styles.unit}> r/s</Text>
	      </Text>
            </ImageBackground>
	    <View style={styles.sliderview}>
		<View><AutoSwitch speed={this.props.value} time={this.props.time} ws={this.props.ws}/></View>
		<Text>                                                           </Text>
		<View><Switch speed={this.props.value} time={this.props.time} ws={this.props.ws}/></View>
	    </View>
	    <View style={styles.widebackground}>
	      <View style={styles.slider_view}>
		<Text style={styles.set_speed}>Set Speed:                          {this.state.value} 
		  <Text style={styles.set_speed_unit}> r/s</Text>		
		</Text>
		  <View style={{alignItems: 'stretch'}}>
                    <Slider
	              maximumValue={530}
	              thumbTintColor={'#5586ff'}
	              step={1}
                      value={this.state.value}
                      onValueChange={(value) => this.setState({value:value})}
		      onSlidingComplete={(value) => {
			 var Json = {
			     'speed': this.state.value,
			     'time': this.state.time
			 };
			 DeviceEventEmitter.emit('set', JSON.stringify(Json));
		      }}>		      
		    </Slider>
                  </View>
              </View>
	      <View style={styles.slider_view}>
		<Text style={styles.set_speed}>Set Time:                             {this.state.time} 
		  <Text style={styles.set_speed_unit}> s</Text>		
		</Text>
		  <View style={{alignItems: 'stretch'}}>
                    <Slider
	              maximumValue={50}
	              thumbTintColor={'#5586ff'}
	              step={1}
                      time={this.state.time}
                      onValueChange={(value) => this.setState({time:value})}
		      onSlidingComplete={(value) => {
			 var Json = {
			     'speed': this.state.value,
			     'time': this.state.time
			 };
			 DeviceEventEmitter.emit('set', JSON.stringify(Json));
		      }}>
		    </Slider>
                  </View>
              </View>
	    </View>
	    <TouchableOpacity onPress={this.onButtonPress}>
              <View style={styles.narrowbackground}>
	        <Image source={require('./image/camera.png')} style={styles.camera}></Image>
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
    backgroundImage:{
        flex: 1,
        width: null,
        height: 712,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    center:{
	flex: 1,
	alignItems: 'center',
    },
    XMU_CHINA_text:{
	fontSize: 35,
	color: 'white',
	marginTop: 20,
    },
    circle: {
        width: 260,
        height: 260,
	alignItems: 'center',
	marginTop: 20,
    },
    Speed_text: {
	fontSize: 25,
	color: 'white',
	marginTop: 45,
    },
    speed_text: {
	fontSize: 85,
        marginLeft: 20,
	marginTop: -8,
    },
    unit: {
    	fontSize: 22,
        color: 'white',
    },
    touchableOpacity: {
	marginTop: -12,
    },
    switchButton: {
	width: 47,
	height: 69,
	//marginLeft: 260,
	resizeMode: 'contain'
    },
    autoswitchButton: {
	width: 55,
	height: 77,
	//marginLeft: 5,
	resizeMode: 'contain'
    },
    widebackground:{
        width: 320,
	height: 160,
	backgroundColor: 'white',
	borderRadius: 15,
	marginTop: 40,
	alignItems: 'center',
	justifyContent: 'center',
    },
    slider_view: {
	width: 250,
    },
    set_speed: {
	fontWeight: '500',
	color: '#5586ff',
	fontSize: 18
    },
    set_speed_unit: {
	fontWeight: '500',
	color: '#5586ff',
	fontSize: 10
    },
    sliderview: {
	flexDirection: 'row',
    },
    narrowbackground:{
        width: 320,
	height: 60,
	backgroundColor: 'white',
	borderRadius: 15,
	marginTop: 20,
	alignItems: 'center',
	justifyContent: 'center',
    },
    camera: {
	width: 36,
	height: 32
    },
});
