import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
} from 'react-native';

import { DeviceEventEmitter } from 'react-native';

export default class Analysis extends Component {
    constructor(props){
	super(props);
	this.state={
	    uploadStatus: 0,
	    url: '',
	    url2: 'http://193.112.70.36:8080/pictures/2.jpg',
	};
	ws = this.props.ws;
    };
    onPress = () => {
	var ts=new Date().getTime();
	this.setState({
		uploadStatus: 1,
		url: 'http://193.112.70.36:8080/pictures/1.jpg?' + ts
	});
    }
    onPress2 = () => {
	var Json = {
    	   'Id':id,
	   'Data':'18',
	   'name':'app'
    	};
    	this.props.ws.send(JSON.stringify(Json));
    }

    componentDidMount() {
	this.listener = DeviceEventEmitter.addListener('ill', (message) => 		{this.setState({url2:message})});
    }
    componentWillUnmount() {
	if (this.listener) {this.listener.remove();}
    }

    render() {
        return (
            <ScrollView style={styles.container}>
	      <ImageBackground source={require('./image/background2.jpg')} style={styles.backgroundImage}>
		<View style={styles.center}>
		  <Image source={(this.state.uploadStatus == 0)?(require('./image/no_image.png')):({uri:this.state.url})} style={styles.image} />
		  <View style={styles.row}>
		    <TouchableOpacity onPress={this.onPress}>
		      <View style={styles.littlebutton}>
		        <Text style={styles.upload}>Upload</Text>
		      </View>
		    </TouchableOpacity>
		    <Text>        </Text>
		    <TouchableOpacity onPress={this.onPress2}>
		      <View style={styles.littlebutton}>
		        <Text style={styles.upload}>Analysis</Text>
		      </View>
		    </TouchableOpacity>
                  </View>
		   <Image source={{uri:this.state.url2}} style={styles.image3} />
		  {/*
		  <Image source={require('./image/result.png')} style={{height: 200, width: 280, resizeMode: 'contain', marginTop:40}}/>
                  */}
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
        height: 712,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    center:{
	flex: 1,
	alignItems: 'center',
    },
    image: {
	width: 300,
	height: 280,
	marginTop: 70,
	resizeMode: 'contain'
    },
    image3: {
	width: 280,
	height: 260,
	marginTop: 20,
	resizeMode: 'contain'
    },
    image2: {
	width: 200,
	height: 280,
	resizeMode: 'contain'
    },
    littlebutton1: {
	backgroundColor: '#5586ff',
	width: 120,
	height: 50,
	alignItems:'center',
    	justifyContent: 'center',
	borderRadius: 15,
	marginTop: 10,
    },
    littlebutton: {
	backgroundColor: '#5586ff',
	width: 120,
	height: 50,
	alignItems:'center',
    	justifyContent: 'center',
	borderRadius: 15,
	marginTop: 10,
    },
    upload: {
	color: 'white',
	fontSize: 20,
	fontWeight: "600"
    },
    row: {
	flexDirection: 'row',
    },
});
