'use strict'

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, TouchableOpacity, Text, View } from 'react-native';
import { Container, Content, Button, Thumbnail } from 'native-base';

import styles from './Styles/MatchedModalStyles'
import I18n from '../I18n';

export default class MatchedModal extends Component {

  static propTypes={
    createChatRoom: PropTypes.func.isRequired,
    resetMatch: PropTypes.func.isRequired,
    currentMatch: PropTypes.object,
    currentRoom: PropTypes.object,
    goToChatRoom: PropTypes.func.isRequired,
    megaMatch: PropTypes.bool.isRequired,
    containerStyle: PropTypes.object
  }

  static defaultProps={
    currentMatch: null,
    currentRoom: null,
    megaMatch: false,
    containerStyle: {}
  }

  constructor(props){
    super(props);
    this.state = {
      isOpen: false
    };
  }

  setModalVis(isOpen){
    this.setState({ isOpen});
  }

  openModal(megaMatch, currentMatch){
    this.setModalVis(true);
  }

  resetModal = () =>{
    this.setModalVis(false);
    this.props.resetMatch();
  }

  componentWillReceiveProps(nextProps){
    if (this.props.currentMatch !== nextProps.currentMatch) {
      console.log(nextProps.currentMatch)
      if (nextProps.currentMatch == null) {
        this.setModalVis(false);
      }else{
        this.setModalVis(true);
        this.props.createChatRoom(nextProps.currentMatch.profile.id);
      }
    }
    //if (this.props.currentRoom !== nextProps.currentRoom) {
    //  if (nextProps.currentRoom !== null) {
    //    this.props.resetMatch();
    //    this.props.navigation.navigate("ChatRoomScreen", {room: nextProps.currentRoom});
    //  }
    //}
  }
  renderModal(){
    let {currentMatch} = this.props
    console.log(currentMatch)
    if(currentMatch !== null){
      let { resetMatch, createChatRoom, navigation, goToChatRoom, containerStyle } = this.props;
      const matchText = I18n.t('matched');
      return (
        <View style={[styles.overlayStyle, containerStyle]}>
          <View style={styles.innerStyle}>
            <TouchableOpacity style={styles.wrapper} onPress={ goToChatRoom } >
              <View style={styles.avatar}>
                <Thumbnail source={{uri: currentMatch.profile.profile_image}} style={styles.avatar}/>
              </View>
            </TouchableOpacity>
            <Text style={styles.matchText}>Matched!</Text>
            <View style={styles.buttonRow}>
              <Button style={styles.button} onPress={ resetMatch }>
                <Text style={styles.buttonText}>Keep Swiping</Text>
              </Button>
              <Button style={styles.buttonRight} onPress={ goToChatRoom }>
                <Text style={styles.buttonText}>Send Message</Text>
              </Button>
            </View>
          </View>
        </View>
      )
    }
    return null
  }
  render(){
    return (
          <Modal
            onRequestClose={this.resetModal}
            transparent={true}
            animationType={'slide'}
            visible={this.state.isOpen}>
              {this.renderModal()}
          </Modal>
    )
  }
}
