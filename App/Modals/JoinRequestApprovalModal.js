'use strict'

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, TouchableOpacity, Text, View } from 'react-native';
import { Container, Content, Button, Thumbnail, Toast } from 'native-base';

import styles from './Styles/JRACreateModalStyles'
import I18n from '../I18n';

export default class JRACreateModal extends Component {

  static propTypes={
    createJRA: PropTypes.func.isRequired,
    goToRoom: PropTypes.func.isRequired,
    resetProps: PropTypes.func.isRequired,
    currentRoom: PropTypes.object,
    containerStyle: PropTypes.object,
    success: PropTypes.bool.string
  }

  static defaultProps={
    goToRoom: ()=>null,
    currentRoom: null,
    containerStyle: {}
  }

  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      currentLocation: props.currentLocation,
      currentRequestApprovalsCount: props.currentRequestApprovals.length
    };
    this._approvalsTimeout=null
  }

  setModalVis(isOpen){
    this.setState({ isOpen});
  }

  openModal(){
    this.setModalVis(true);
  }

  setCurrentLocation(currentLocation){
    this.setState({currentLocation});
  }

  resetModal = () =>{
    this.setModalVis(false);
    this.props.resetMatch();
  }

  _renderCreateGroup(){
    return null
  }

  _renderRequestApproval(){
    return null
  }

  setCurrentRequestApprovalsCount(currentRequestApprovalsCount){
    this.setState({ currentRequestApprovalsCount })
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.currentLocation !== this.props.currentLocation ||
        nextProps.currentRoom !== this.props.currentRoom
    ){
      this.setModalVis(true);
    }
    if (nextProps.success !== null && this.props.success !== nextProps.success){
        Toast.show({
            text: nextProps.success,
            position: 'bottom',
            buttonText: 'Okay',
            duration: 2500,
            onClose:()=>this.props.resetMatch() // reset redux success text but don't close modal
        });
    }
  /*
    if (this.props.currentRequestApprovals.length < nextProps.currentRequestApprovals.length) {
      // if a requestApproval comes in short succession of another, we remove the timeout to add the users
      // ** Performance and UX enhancement, reduces the calls made to add users to the group
      //  IE. imagine 20 or 100 requests coming in a matter of 10 seconds, this would get called 20 to 100 times.
      //  However, the way this is engineered, as long as those requests came within the timeout set, subsequent requests
      //  would be batched together while adding users. The timeout is short because if we wait too long, the UX
      //  would suffer.

      if (this._approvalsTimeout !== null) clearTimeout(this._approvalsTimeout);
      if (nextProps.currentGroup == null) {
        this.setModalVis(false);
      } else{
        this._approvalsTimeout = setTimeout(()=>{
          this.setModalVis(true);
          this._approvalsTimeout = null;
        },2000)
      }
    }
  */
  }


  renderModal(){
    let { currentRequestApprovals } = this.props
    console.log(currentMatch)
    views = []

    for ( r in currentRequestApprovals){
      views.push()
    }

      let { resetMatch, createChatRoom, navigation, goToChatRoom, containerStyle } = this.props;
      return (
        <View style={[styles.overlayStyle, containerStyle]}>
          <View style={styles.innerStyle}>
            <TouchableOpacity style={styles.wrapper} onPress={ goToChatRoom } >
              <View style={styles.avatar}>
                <Thumbnail source={{uri: currentRoom.}} style={styles.avatar}/>
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
