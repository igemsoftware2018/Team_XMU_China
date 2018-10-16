import React, {Component} from  'react';
import {
    AppRegistry,
    Switch,
} from 'react-native';
class SwitchG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: false
        };
    }
    render() {
        return (
            <Switch
                value={this.state.value}
		onTintColor='#C173B8'
                onValueChange={(value)=>{
		    	this.setState({value: value});
			var Json = {
			    'Id':1,
                            'Data':value,
			    'name':'app'
			};
			this.props.ws.send(JSON.stringify(Json));
                    }
		}
            />
        )
    }
}
module.exports = SwitchG;
