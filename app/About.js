import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ImageBackground
} from 'react-native';

export default class home4 extends Component {

    render() {
        return (
        <ScrollView style={styles.container}>
          <ImageBackground source={require('./image/About.jpeg')} style={styles.backgroundImage}>
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
    }
});
