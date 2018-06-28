'use strict'

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TextInput, View, Alert } from 'react-native';
import { Button} from 'native-base';
import ModalDropdown from 'react-native-modal-dropdown';
import { flagDbIndex } from '../Transforms/DropDowns';
import { flagReasons } from '../Config/DropdownOptions';

import styles from './Styles/FlagModalStyles'
import I18n from '../I18n';

class FlagModal extends Component {

  static propTypes={
    flagMessage: PropTypes.func.isRequired,
    removeMessageFlag: PropTypes.func.isRequired,
    resetFlag: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      flagReason: null,
      flagReasonId: null,
      flagComment: "",
      flagged: false,
      hasFlagged: false,
      roomId: null,
      messageId: null
    };
  }

  setModalVis(isOpen){
    this.setState({ isOpen});
  }

  setFlagReasonId(flagReasonId){
    this.setState({ flagReasonId });
  }

  setFlagReason(flagReason){
    this.setState({ flagReason });
  }

  setFlagComment(flagComment){
    this.setState({flagComment});
  }

  setFlagged(flagged){
    this.setState({flagged});
  }

  setRoomId(roomId){
    this.setState({roomId: roomId});
  }

  setMessageId(messageId){
    this.setState({messageId});
  }

  setHasFlagged(hasFlagged){
    this.setState({hasFlagged});
  }
  _onFlagDropdownSelect(idx, value, user, roomId){
    this.setFlagReasonId(flagDbIndex(idx));
    this.setFlagReason(value);
  }
  _validateFlagForm(){
    return true;
  }
  _renderFlagDropdown(){
   const options = flagReasons;
    if(this.state.isOpen){
      return (
      <ModalDropdown dropdownTextStyle={{ fontSize:20 }} options={options} onSelect={(idx, value) => this._onFlagDropdownSelect(idx, value)}>
        <Text style={styles.dropdownText}>{this.state.flagReason == null ? I18n.t('flagReason') : this.state.flagReason}</Text>
      </ModalDropdown>)
    }
    return null
  }
  _renderFlagTextInput(){
    if(this.state.isOpen){
      return (<TextInput
                  style={styles.flagInput}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={500}
                  onChangeText={(text) => this.setFlagComment(text)}
                  value={this.state.flagComment}/>)
    }
    return null;
  }
  _renderFlagButton(){
    return (<Button style={styles.flagButton} onPress={()=>{
      if(this._validateFlagForm()){
        this.props.flagMessage(this.state.messageId, this.state.flagReasonId, this.state.flagComment, this.state.roomId);
      }else{
        return null
      }
        }
      }>
      <Text style={styles.flagButtonText}>{I18n.t('flag')}</Text>
    </Button>)

  }

  openModal(messageId, roomId, hasFlagged){
    this.setModalVis(true);
    this.setMessageId(messageId);
    this.setRoomId(roomId);
    this.setHasFlagged(hasFlagged);
  }

  removeFlagAlert(messageId, roomId){
    const removeFlag = `${I18n.t('remove')} ${I18n.t('flag')}`;
    Alert.alert(removeFlag, `${I18n.t('youSure')} ${removeFlag.toLowerCase()}?`,
      [
        {text: removeFlag , onPress:()=>this.props.removeMessageFlag(messageId, roomId)},
        {text: I18n.t('cancel'), onPress:()=>null},
      ]);
  }

  resetFlagForm = () =>{
    this.setState({
      flagComment: '',
      flagReason: null,
      flagReasonId: null,
      flagged: false,
      hasFlagged: false,
      roomId: null,
      isOpen: false,
      messageId: null
    });
    this.props.resetFlag();
  }
  _renderFlagResult(nextProps){
    if(this.state.isOpen && nextProps.success !== null && nextProps.success !== this.props.success){
      const reasonId = `reason${this.state.flagReasonId}`;
      Alert.alert(
        I18n.t('flagged'),
        nextProps.success,
        [{text: I18n.t('dismiss'), onPress:this.resetFlagForm}]
      )
    }
  }

  goToChatRoom(){
    this.props.navigation.navigate("ChatRoomScreen", {room: nextProps.currentRoom});
  }

  componentWillReceiveProps(nextProps){
    this._renderFlagResult(nextProps);
  }

  componentWillUnmount(){
    if(this.state.isOpen) this.setModalVis(false);
  }

  render(){
    return (
          <Modal onRequestClose={()=>this.setModalVis(false)} transparent={true} animationType={'slide'} visible={this.state.isOpen}>
            <View style={styles.overlayStyle}>
              {this._renderFlagDropdown()}
              {this._renderFlagTextInput()}
              {this._renderFlagButton()}
            </View>
          </Modal>
    )
  }
}
export default FlagModal
