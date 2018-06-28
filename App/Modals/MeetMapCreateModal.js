'use strict'

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, TouchableOpacity, Text, View } from 'react-native';
import { Container, Content, Form, Textarea, Label, Button, Thumbnail, Toast } from 'native-base';

import styles from './Styles/MeetMapCreateModalStyles'
import I18n from '../I18n';

export default class MeetMapCreateModal extends Component {

  static propTypes={
    createRoom: PropTypes.func.isRequired,
    goToRoom: PropTypes.func.isRequired,
    resetCreatedRoom: PropTypes.func.isRequired,
    createdRoom: PropTypes.object,
    currentLocation: PropTypes.object,
    resetSuccess: PropTypes.func.isRequired,
    success: PropTypes.string,
    containerStyle: PropTypes.object,
    isPoi: PropTypes.bool.isRequired,
  }

  static defaultProps={
    isPoi: false,
    goToRoom: ()=>null,
    resetCreatedRoom: ()=>null,
    resetSuccess: ()=>null,
    success:null,
    createdRoom: null,
    currentLocation: null,
    containerStyle: {}
  }

  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      currentLocation: props.currentLocation,
      inviteMessageText: '',
      roomTitle:'',
    };
  }

  setModalVis(isOpen){
    this.setState({ isOpen});
  }

  openModal(){
    this.setModalVis(true);
  }

  closeModal(){
    this.setModalVis(false);
  }

  setCurrentLocation(currentLocation){
    this.setState({currentLocation});
  }

  resetModal = () =>{
    this.closeModal();
    this.props.resetSuccess();
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
    if (nextProps.currentLocation !== this.props.currentLocation  ){
      this.setModalVis(true);
    }
    if( nextProps.createdRoom !== this.props.createdRoom){
      this.setState({ roomCreated: nextProps.createdRoom == null ? false : true});
      if(nextProps.createdRoom == null){
        this.setModalVis(false);
      }
    }
    if (nextProps.success !== null && this.props.success !== nextProps.success){
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
  _renderCreateRoomButton(){
    return (
      <Button style={styles.buttonRight} onPress={ this.createRoomClick}>
        <Text style={styles.buttonText}>Create Room</Text>
      </Button>
    )
  }
  _renderGoToRoomButton(goToRoom){
    return (
      <Button style={styles.button} onPress={ goToRoom}>
        <Text style={styles.buttonText}>Go To Room</Text>
      </Button>
    )
  }
  createRoomClick = () => {
    console.log(this.props.currentLocation)
    this.props.createRoom(this.state.title,this.props.currentLocation,[])
  }

  handleInviteMessageText = (inviteMessageText) => this.setState({ inviteMessageText });

  handleTitleText = (title) => this.setState({ title });

  _renderTextarea(label, value, onChangeText){
    return (
      <View>
        <Label style={styles.usernameText}>{ label }</Label>
        <Textarea bordered
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
      <Form style={{flex:1}}>
        { this._renderTextarea("Invite Message", this.state.inviteMessageText, this.handleInviteMessageText) }
        { this._renderTextarea("Room Name", this.state.title, this.handleTitleText) }
      </Form>
    )
  }

  renderModal(){
    let {currentLocation} = this.props
    console.log(currentLocation)
    if(currentLocation !== null){
      let { createRoom, createdRoom, navigation, goToRoom, containerStyle } = this.props;
      return (
        <View style={[styles.overlayStyle, {backgroundColor:'#00000080'}]}>
          <View style={styles.innerStyle}>
            { createdRoom !== null ?
              <TouchableOpacity style={styles.wrapper} onPress={ goToRoom } >
                <View style={styles.avatar}>
                  <Thumbnail
                    source={{uri: createdRoom.users[0].profile.profile_image_url}}
                    style={styles.avatar}/>
                </View>
              </TouchableOpacity> : this._renderForm()
            }
            <Text style={styles.matchText}>Create New Group!</Text>
            <View style={styles.buttonRow}>
              <Button style={styles.button} onPress={ this.resetModal}>
                <Text style={styles.buttonText}>Return to Meet Map</Text>
              </Button>
              {
                createdRoom !== null ?
                  this._renderGoToRoomButton(goToRoom) :
                   this._renderCreateRoomButton()
              }
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
