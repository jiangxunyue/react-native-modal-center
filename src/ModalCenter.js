import React, {Component} from 'react';
import {
    Modal
} from 'react-native'
import {Sequence} from './sequence';
import emitter, {HIDE_MODAL_IN_CENTER, SHOW_MODAL_CENTER, HIDE_ALL_MODAL_IN_CENTER} from './InjectRegisterComponent';
import invariant from 'fbjs/lib/invariant';
const REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;

const DEFAULT_MODAL_STYLE = Object.freeze({animationType: 'none', transparent: true, onRequestClose: true});

export default class ModalCenter extends Component {

    constructor(props) {
        super(props);
        this.state = this.initState;
        this.modalSequence = new Sequence();
        this.currentShowNode = null;
    }
    get initState() {
        return {
            ...DEFAULT_MODAL_STYLE,
            child: null,
            isVisible: false,
        };
    }

    static show(element){
        emitter.emit(SHOW_MODAL_CENTER, element);
    };
    static hide(key) {
        emitter.emit(HIDE_MODAL_IN_CENTER, key);
    };
    static hideAll() {
        emitter.emit(HIDE_ALL_MODAL_IN_CENTER);
    };

    // priority : >=1
    // modalStyle: {animationType: string, transparent: boolean}
    /**
     *
     * @param element:
     *                  React.Element
     *                      or
     *                  {
     *                      element: React.Element,
     *                      priority: number,   表示优先级
     *                      modalStyle: {
     *                          animationType: string,  default: none
     *                          transparent: boolean,   default: true
     *                          onRequestClose: boolean default: true 安卓上是否启用返回键关闭功能
     *                      }
     *                  }
     */
    addModal = (element) => {
        let value = null;
        let priority = 1;
        let modalStyle = DEFAULT_MODAL_STYLE;
        invariant(element && (element instanceof Object), 'The element pass to ModalCenter must be an valid Object');
        if (element.$$typeof === REACT_ELEMENT_TYPE) {
            value = element;
        }else {
            value = element.element;
            priority = element.priority || priority;
            modalStyle = {...modalStyle, ...(element.modalStyle || {}),};
        }
        let key = value.key;

        key && invariant(!(this.currentShowNode && (this.currentShowNode.value.element.key === value.key)), 'The ModalCenter already has a subModal with key -- "' + key + '"');

        let wrapElement = React.cloneElement(value, {hideModal: this.hideModal});
        this.modalSequence.addNode({element: wrapElement, modalStyle}, priority);
        if (!this.currentShowNode) {
            this.showNext();
        }
    };
    hideModal = () => {
        this.showNext();
    };
    hideAll = () => {
        this.modalSequence.removeAll();
        this.showNext();
    };
    removeModal = (key) => {
        if (this.currentShowNode) {
            let {element} = this.currentShowNode.value;
            if (element.key === key) {
                this.showNext();
            }else {
                this.modalSequence.removeNodeByKey(key);
            }
        }
    };
    showNext() {
        this.currentShowNode = this.modalSequence.shiftNode();
        if (this.currentShowNode) {
            let value = this.currentShowNode.value;
            // Themes.configLayoutAnimation(100);
            this.setState({
                child: value.element,
                isVisible: true,
                ...value.modalStyle
            })
        }else {
            this.setState({
                ...this.initState
            })
        }
    }
    onRequestClose = () => {
        // TODO:

    };
    render() {
        //  <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.6)'}}>{child}</View>
        let {isVisible, animationType, child, transparent, onRequestClose} = this.state;
        return (
            <Modal visible={isVisible}
                   animationType={animationType}
                   transparent={transparent}
                   onRequestClose ={this.state.onRequestClose? this.hideModal: this.onRequestClose}>
                {child}
            </Modal>
        )
    }
}