import React, {Component} from 'react';
import {
    AppRegistry,
    View
} from 'react-native';
import ModalCenter from './ModalCenter';
import EventEmitter from 'react-native/Libraries/EventEmitter/EventEmitter';
export const SHOW_MODAL_CENTER = 'SHOW_MODAL_CENTER';
export const HIDE_MODAL_IN_CENTER = 'HIDE_MODAL_IN_CENTER';
export const HIDE_ALL_MODAL_IN_CENTER = 'HIDE_ALL_MODAL_IN_CENTER';

let emitter = AppRegistry.modalCenterEmitter;

if (!(emitter instanceof EventEmitter)) {
    let oldRegisterComponent = AppRegistry.registerComponent;
    emitter = new EventEmitter();
    AppRegistry.modalCenterEmitter = emitter;

    AppRegistry.registerComponent = function (appKey, componentProvider) {
        let AppEntryComponent = componentProvider();
        class NewApp extends Component {
            _refModal = null;
            componentWillMount() {
                emitter.addListener(SHOW_MODAL_CENTER, this.show);
                emitter.addListener(HIDE_MODAL_IN_CENTER, this.hide);
                emitter.addListener(HIDE_ALL_MODAL_IN_CENTER, this.hideAll);
            }
            componentWillUnmount() {
                emitter.removeListener(SHOW_MODAL_CENTER, this.show);
                emitter.removeListener(HIDE_MODAL_IN_CENTER, this.hide);
                emitter.removeListener(HIDE_ALL_MODAL_IN_CENTER, this.hideAll);
            }
            show = (element) => {
                this._refModal && this._refModal.addModal && this._refModal.addModal(element);
            };
            hide = (key) => {
                this._refModal && this._refModal.removeModal && this._refModal.removeModal(key);
            };
            hideAll = () => {
                this._refModal && this._refModal.hideAll && this._refModal.hideAll();
            };
            render() {
                let modalCenter = <ModalCenter key="modalCenter" ref={modal => this._refModal = modal}/>;
                return (
                    <View style={{flex: 1}}>
                        <AppEntryComponent {...(this.props || {})}/>
                        {modalCenter}
                    </View>
                )
            }
        }

        return oldRegisterComponent(appKey, () => NewApp);
    };
}

export default emitter