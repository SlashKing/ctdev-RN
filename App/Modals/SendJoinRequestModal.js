'use strict'

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, TouchableOpacity, Text, View, Animated, InteractionManager, Dimensions } from 'react-native';
import { Container, Form, Textarea, Label, Button, Thumbnail, Toast } from 'native-base';

import styles from './Styles/ReceiveJoinRequestModalStyles'
import I18n from '../I18n';
export default class ReceiveJoinRequestModal extends Component {

  static propTypes={
    acceptJoinRequest: PropTypes.func.isRequired,
    rejectJoinRequest: PropTypes.func.isRequired,
    goToRoom: PropTypes.func.isRequired,
    resetCurrentJoinRequest: PropTypes.func.isRequired,
    currentJoinRequest: PropTypes.object,
    currentUser: PropTypes.number.isRequired,
    resetSuccess: PropTypes.func.isRequired,
    success: PropTypes.string,
    containerStyle: PropTypes.object,
  }

  static defaultProps={
    acceptJoinRequest: ()=>null,
    rejectJoinRequest: ()=>null,
    goToRoom: ()=>null,
    resetCurrentJoinRequest: ()=>null,
    resetSuccess: ()=>null,
    success:null,
    currentJoinRequest: null,
    currentUser: -1,
    containerStyle: {}
  }

  constructor(props){
    super(props);
    this.state = {
      isOpen: props.currentJoinRequest !== null ? true : false,
      roomTitle:props.currentJoinRequest.name,
    };
    this.enter = new Animated.Value(0) // 0 -> 1
  }

  setModalVis(isOpen){
    this.setState({ isOpen });
  }

  openModal(){
    this.setModalVis(true);
  }

  closeModal(){
    this.setModalVis(false);
  }

  resetModal = () =>{
    this.closeModal();
    this.props.resetCurrentJoinRequest();
    this.props.resetSuccess();
  }

  componentDidMount(){
  }
  componentWillReceiveProps(nextProps){
    console.log(this.props,nextProps)
    if (nextProps.currentJoinRequest !== this.props.currentJoinRequest  ){
      this.setModalVis(true);
    }
    if (nextProps.success !== null && this.props.success !== nextProps.success){
        console.log('success');
        Toast.show({
            text: nextProps.success,
            position: 'bottom',
            buttonText: 'Okay',
            duration: 2500,
            onClose:()=>this.props.resetSuccess() // reset redux success text but don't close modal
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
  _renderJoinRequestButton(){
    return (
      <Button style={[ styles.button, styles.buttonRight]} onPress={ this.JoinRequestClick}>
        <Text style={styles.buttonText}>Send Join Request</Text>
      </Button>
    )
  }

  JoinRequestClick = () => {
    this.props.sendJoinRequest(this.state.title,this.props.currentJoinRequest,[])
  }

  handleInviteMessageText = (inviteMessageText) => this.setState({ inviteMessageText });

  _renderTextarea(label, value, onChangeText){
    return (
      <View style={styles.textWithLabelWrap}>
        <Label style={styles.usernameText}>{ label }</Label>
        <Textarea bordered cornered
        rowSpan={5}
        style={styles.textarea}
        value={ value }
        onChangeText={onChangeText}
        />
      </View>
    )
  }

  _renderForm(){
    return (
      <Form style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
        <Text style={styles.matchText}>{ this.props.currentJoinRequest.name }</Text>
        { this._renderTextarea("Invite Message", this.state.inviteMessageText, this.handleInviteMessageText) }
      </Form>
    )
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>Animated.spring(this.enter,
        {
          toValue:1,
          friction:4,
          useNativeDriver:true
        }).start(()=>console.log('animation callback')))
  }

  renderModal(){
    const { currentJoinRequest } = this.props
    if(currentJoinRequest !== null){
      let { sendJoinRequest, currentJoinRequest, goToRoom, containerStyle } = this.props;
      return (
        <View style={[styles.overlayStyle, {backgroundColor:'#00000080'}]}>
          <View style={styles.innerStyle}>
            <View style={styles.wrapper} >
              <TouchableOpacity style={styles.avatar} onPress={ goToRoom } >
                <Animated.Image
                  source={{uri: currentJoinRequest.users[0].profile.profile_image}}
                  style={[styles.avatar, {
                    transform:[
                      { scale: this.enter }
                    ]}
                  ]}
                />
              </TouchableOpacity>
              { this._renderForm() }
            </View>
          </View>
          <View style={styles.buttonRow}>
            <Button style={styles.button} onPress={ this.resetModal}>
              <Text style={styles.buttonText}>Return to Meet Map</Text>
            </Button>
            { this._renderJoinRequestButton() }
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
