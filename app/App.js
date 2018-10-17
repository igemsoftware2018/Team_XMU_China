import React, {Component} from 'react';

import './shim.js';
import 'crypto';

import {
    Image,
} from 'react-native';

import {
    createMaterialTopTabNavigator,
    StackNavigator,
} from 'react-navigation';

import Control from './Control';
import Analysis from './Analysis';
import Diagnosis from './Diagnosis';
import About from './About';
import { DeviceEventEmitter } from 'react-native';

var ws = new WebSocket('ws://193.112.70.36:3000');

var id = Math.ceil(Math.random()*10);

ws.onopen = function(e){
    console.log('Connection to server opened');
}

ws.onmessage = function(evt){
    //alert(evt.data);
    var data = JSON.parse(evt.data);
    if(data.Data == '1'){
    	DeviceEventEmitter.emit('speed', data.message);
    }
    else if(data.Data == '2'){	
   	DeviceEventEmitter.emit('address', data.message);
    }
    else if(data.Data == '3'){
    	DeviceEventEmitter.emit('rest', data.message);
    }
    else if(data.Data == '4'){
	DeviceEventEmitter.emit('purchase', data.message);
    }
    else if(data.Data == '5'){
	DeviceEventEmitter.emit('contract', data.message);
    }
    else if(data.Data == '6'){
	DeviceEventEmitter.emit('diagnosisload', evt.data);
    }
    else if(data.Data == '7'){
	DeviceEventEmitter.emit('permission', data.message);
    }
    else if(data.Data == '8'){
	delete data["Data"];
	var str = JSON.stringify(data);
	DeviceEventEmitter.emit('diagnosisown', str);
    }
    else if(data.Data == '9'){
	DeviceEventEmitter.emit('ill', data.url);
    }
    else{
	DeviceEventEmitter.emit('diagnosis', evt.data);
    }
}

const Navigator = createMaterialTopTabNavigator({
    Control: {
        screen: () => (<Control ws={ws} id={id}/>),
        navigationOptions: {
	    title:'Control',
            tabBarLabel: 'Control',
            tabBarIcon: ({tintColor}) => (
                <Image
                    source={require('./image/control_panel.png')}
                    style={[{height: 24, width: 24}, {tintColor: tintColor}]}
                />
            ),
        },
    },
    Analysis: {
        screen: () => (<Analysis ws={ws} id={id}/>),
        navigationOptions: {
	    headerTitle:'Analysis',
            tabBarLabel: 'Analysis',
            tabBarIcon: ({tintColor}) => (
                <Image
                    source={require('./image/ai.png')}
                    style={[{height: 24, width: 24}, {tintColor: tintColor}]}/>
            ),
        }
    },
    Diagnosis: {
        screen: () => (<Diagnosis ws={ws} id={id}/>),
        navigationOptions: {
	    headerTitle:'Diagnosis',
            tabBarLabel: 'Diagnosis',
            tabBarIcon: ({tintColor}) => (
                <Image
                    source={require('./image/file.png')}
                    style={[{height: 24, width: 24}, {tintColor: tintColor}]}/>
            ),
        }
    },
    About: {
        screen: About,
        navigationOptions: {
	    headerTitle:'About',
            tabBarLabel: 'About',
            tabBarIcon: ({tintColor}) => (
                <Image
                    source={require('./image/about.png')}
                    style={[{height: 24, width: 24}, {tintColor: tintColor}]}/>
            ),
        }
    },

}, {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
    backBehavior: "none",
    tabBarOptions: {
        upperCaseLabel: false,
        showIcon: true,
        showLabel: true,
        activeTintColor: '#C173B8',
        inactiveTintColor: 'gray',
        style: { 
            backgroundColor: 'white',
            height: 50,
        },
        indicatorStyle: {
            height: 0,
        },
        labelStyle: {
            fontSize: 12,
            marginTop: -5,
            marginBottom: 5,
        },
        iconStyle: {
            marginBottom: 5,
        }
    },
});

export default class App extends Component {
    constructor(props){
	super(props);
    }/*
    componentDidMount() {
	this.listener = DeviceEventEmitter.addListener('speed', (message) => {alert(message);});
    }*/
    render() {
        return (
            <Navigator />
        );
    }
}

