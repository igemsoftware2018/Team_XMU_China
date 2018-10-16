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
    Switch,
    ScrollView
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var ws = new WebSocket('ws://193.112.70.36:3000');
//var ws = new WebSocket('ws://192.168.0.112:3000');
ws.onopen = function(e){
    console.log('Connection to server opened');
}

var speed;

ws.onmessage = function(evt){
    Alert.alert(evt.data);
    //speed = evt.data;
}

const onButtonPress = () => {  /*take photo*/
    var Json = {
    	'Id':1,
	'Data':'3',
	'name':'app'
    };
    ws.send(JSON.stringify(Json));
}

const onButtonPress3 = () => {  /*send speed*/
    var Json = {
    	'Id':1,
	'Data':'7',
	'name':'app'
    };
    ws.send(JSON.stringify(Json));
}

const onButtonPress2 = () => {  /*require speed*/
    var Json = {
    	'Id':1,
	'Data':'2',
	'name':'app'
    };
    ws.send(JSON.stringify(Json));
}

const onButtonPress1 = () => { /*test*/
    var Json = {
        'Id':1,
        'Data':'-1',
        'name':'app'
    };
    ws.send(JSON.stringify(Json));
}

type Props = {};
export default class Control extends Component<Props> {
    constructor(props){
	super(props);
	this.state = {
	    InputText: "0"
	}
    }
    render() {
    return (
      <View style={styles.container}>
	<Image source={require('./image/background.png')} style={styles.backgroundImage}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
	flex: 1,
    },
    backgroundImage:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        width:null,
        height:null,
        //不加这句，就是按照屏幕高度自适应
        //加上这几，就是按照屏幕自适应
        //resizeMode:Image.resizeMode.contain,
        //祛除内部元素的白色背景
        backgroundColor:'rgba(0,0,0,0)',
    }
});
