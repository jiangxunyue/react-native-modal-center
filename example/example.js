/** 
 * To execute this example:
 * In project's entry file : import "react-native-modal-center"
 
 * In some Component's liftStyle function, just add the following line ----
 * require('react-native-modal-center/example/example')();
 */

import React, {Component} from 'react';
import {
    View,
    Button,
} from 'react-native';
import ModalCenter from 'react-native-modal-center';
class AAA extends Component {
    render() {
        return (
            <View style={{flex:1, backgroundColor: 'blue', padding: 100}}>
                <Button title={'hideA'} color="white" style={{width: 100, height: 100, backgroundColor: 'red', marginTop: 100}} onPress={this.props.hideModal}/>
            </View>
        )
    }
}
class BBB extends Component {
    render() {
        return (
            <View style={{flex:1, backgroundColor: 'red', padding: 100}}>
                <Button title={'hideB'} color="white" style={{width: 100, height: 100, backgroundColor: 'blue', marginTop: 100}} onPress={this.props.hideModal}/>
            </View>
        )
    }
}
class CCC extends Component {
    render() {
        return (
            <View style={{flex:1, backgroundColor: 'green', padding: 100}}>
                <Button title={'hideC'} color="white" style={{width: 100, height: 100, backgroundColor: 'blue', marginTop: 100}} onPress={this.props.hideModal}/>
            </View>
        )
    }
}

function example() {
    requestAnimationFrame(() => {
        ModalCenter.show(<AAA key="10"/>);
        ModalCenter.show({element: <AAA key="101"/>, priority: 11});
        ModalCenter.show(<BBB key="102"/>);
        ModalCenter.show({element: <CCC key="cc"/>, priority: 12});
        setTimeout(_ => {
            ModalCenter.hide('102');
        }, 5000)
    })
};

module.exports = example;